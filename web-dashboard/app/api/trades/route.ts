import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TradeLog from "@/models/TradeLog";
import { z } from "zod";

// Zod schema for signal creation validation
const signalSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  providerName: z.string().min(1, "Provider Name is required"),
  asset: z.string().min(1, "Asset is required"),
  signalType: z.enum(["Scalping", "Run"]),
  action: z.enum(["BUY", "SELL"]),
  entry: z.number().positive(),
  sl: z.number().positive(),
  tp1: z.number().positive(),
  tp2: z.number().positive().optional().nullable(),
  fullTp: z.number().positive().optional().nullable(),
}).refine((data) => {
  if (data.action === "BUY") {
    return data.sl < data.entry && data.tp1 > data.entry;
  } else {
    return data.sl > data.entry && data.tp1 < data.entry;
  }
}, {
  message: "Invalid SL/TP1 for the given action (BUY: SL < Entry < TP1, SELL: SL > Entry > TP1)",
  path: ["sl"], // attach error to sl
}).refine((data) => {
  if (data.tp2) {
    if (data.action === "BUY") return data.tp2 > data.tp1;
    if (data.action === "SELL") return data.tp2 < data.tp1;
  }
  return true;
}, {
  message: "TP2 must be further than TP1",
  path: ["tp2"],
}).refine((data) => {
  if (data.fullTp && data.tp2) {
    if (data.action === "BUY") return data.fullTp > data.tp2;
    if (data.action === "SELL") return data.fullTp < data.tp2;
  } else if (data.fullTp && !data.tp2) {
    if (data.action === "BUY") return data.fullTp > data.tp1;
    if (data.action === "SELL") return data.fullTp < data.tp1;
  }
  return true;
}, {
  message: "Full TP must be further than previous TPs",
  path: ["fullTp"],
});

// Generate a unique 6-char alphanumeric tradeId with collision retry.
// Why retry: Math.random can theoretically produce a duplicate. If that hits
// the unique index, the whole signal creation would fail and roll back the
// Discord message — confusing for the user. 5 attempts is more than enough.
async function generateTradeId(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    const exists = await TradeLog.findOne({ tradeId: id });
    if (!exists) return id;
  }
  throw new Error("Failed to generate unique tradeId after 5 attempts");
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "active" or "closed"

    let filter = {};
    if (status === "active") filter = { isClosed: false };
    if (status === "closed") filter = { isClosed: true };

    const trades = await TradeLog.find(filter).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(trades);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validation
    const parseResult = signalSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessage = (parseResult.error as any).errors?.[0]?.message || "Validation Error";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
    const data = parseResult.data;
    
    // 2. Channel Routing
    const CHANNEL_SCALPING = "1526158679047536661";
    const CHANNEL_RUN = "1524471687691763742";
    const channelId = data.signalType === "Scalping" ? CHANNEL_SCALPING : CHANNEL_RUN;
    
    const VIP_ROLE_ID = process.env.VIP_ROLE_ID || "";
    
    // 3. Format Embed
    const embedColor = data.action === 'BUY' ? 0x00ff9f : 0xff3333;
    const embed = {
      color: embedColor,
      title: `⚡ SIGNAL ALERT: ${data.asset} ${data.action} (${data.signalType})`,
      fields: [
        { name: '🎯 Entry', value: `**${data.entry}**`, inline: true },
        { name: '🛑 Stop Loss', value: `**${data.sl}**`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '🚀 TP1', value: `**${data.tp1}**`, inline: true }
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'VIP Trade • การลงทุนมีความเสี่ยง' }
    };
    
    if (data.tp2) embed.fields.push({ name: '🚀 TP2', value: `**${data.tp2}**`, inline: true });
    if (data.fullTp) embed.fields.push({ name: '🌕 Full TP', value: `**${data.fullTp}**`, inline: true });
    
    // 4. Format Buttons
    const components = [
      {
        type: 1,
        components: [
          { type: 2, custom_id: 'btn_tp1', label: '🎯 TP1', style: 3 },
          ...(data.tp2 ? [{ type: 2, custom_id: 'btn_tp2', label: '🎯 TP2', style: 3 }] : []),
          ...(data.fullTp ? [{ type: 2, custom_id: 'btn_fulltp', label: '🚀 Full TP', style: 3 }] : [])
        ]
      },
      {
        type: 1,
        components: [
          { type: 2, custom_id: 'btn_sl', label: '🛑 Hit SL', style: 4 },
          { type: 2, custom_id: 'btn_alertbe', label: '🔔 แจ้ง BE', style: 2 },
          { type: 2, custom_id: 'btn_be', label: '🛡️ BE', style: 2 },
          { type: 2, custom_id: 'btn_close', label: '⏹️ Close', style: 1 },
          { type: 2, custom_id: 'cancel_order', label: '❌ ยกเลิกออเดอร์', style: 4 }
        ]
      }
    ];

    // 5. Send to Discord
    const discordResponse = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${process.env.DISCORD_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: VIP_ROLE_ID ? `<@&${VIP_ROLE_ID}> ⚡ สัญญาณเทรดใหม่มาแล้วครับ!` : "⚡ สัญญาณเทรดใหม่มาแล้วครับ!",
        embeds: [embed],
        components: components
      })
    });
    
    if (!discordResponse.ok) {
      const errorData = await discordResponse.json();
      console.error("Discord API Error:", errorData);
      return NextResponse.json({ error: "Failed to send message to Discord." }, { status: 500 });
    }
    
    const discordMessage = await discordResponse.json();
    const messageId = discordMessage.id;
    
    // 6. Save to DB (connect first — generateTradeId needs DB access for collision check)
    await connectToDatabase();
    
    const tradeId = await generateTradeId();
    
    try {
      const newTrade = new TradeLog({
        tradeId,
        signalType: data.signalType,
        messageId,
        providerId: data.providerId,
        providerName: data.providerName,
        asset: data.asset,
        action: data.action,
        entry: data.entry,
        sl: data.sl,
        tp1: data.tp1,
        tp2: data.tp2 || null,
        fullTp: data.fullTp || null,
        status: 'ON GOING'
      });
      await newTrade.save();
      
      return NextResponse.json({ success: true, tradeId, messageId }, { status: 201 });
      
    } catch (dbError) {
      console.error("MongoDB Error, rolling back Discord message:", dbError);
      
      // Rollback: Delete Discord Message
      await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bot ${process.env.DISCORD_TOKEN}`
        }
      });
      
      return NextResponse.json({ error: "Database error. Signal creation rolled back." }, { status: 500 });
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
