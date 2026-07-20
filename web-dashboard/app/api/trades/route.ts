import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TradeLog from "@/models/TradeLog";

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
