import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TradeLog from "@/models/TradeLog";
import { apiHandler } from "@/lib/api-handler";

export const GET = apiHandler(async () => {
  await connectToDatabase();
  const trades = await TradeLog.find({ isClosed: true }).lean();

  let wins = 0;
  let losses = 0;
  let buyCount = 0;
  let sellCount = 0;

  const providerMap = new Map();
  const monthlyMap = new Map();
  const assetMap = new Map();
  const durationMap = new Map();
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const sortedTrades = [...trades].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  let cumulativeRR = 0;
  let cumulativePoints = 0;
  const performanceData: any[] = [];
  
  sortedTrades.forEach(t => {
    const isWin = t.rr > 0 || t.points > 0 || t.status === "WIN" || String(t.status).includes("TP");
    
    // Win/Loss
    if (isWin) wins++;
    else losses++;

    // Buy/Sell
    if (t.action === "BUY") buyCount++;
    if (t.action === "SELL") sellCount++;

    // Provider
    const pId = t.providerName || t.providerId || "Unknown";
    if (!providerMap.has(pId)) {
      providerMap.set(pId, { id: pId, name: pId, wins: 0, total: 0, rr: 0, points: 0, currentStreak: 0, maxStreak: 0 });
    }
    const p = providerMap.get(pId);
    p.total++;
    if (isWin) {
      p.wins++;
      p.currentStreak++;
      if (p.currentStreak > p.maxStreak) p.maxStreak = p.currentStreak;
    } else {
      p.currentStreak = 0;
    }
    p.rr += t.rr || 0;
    p.points += t.points || 0;

    // Asset
    const asset = t.asset || "Unknown";
    if (!assetMap.has(asset)) assetMap.set(asset, { name: asset, trades: 0, rr: 0 });
    const a = assetMap.get(asset);
    a.trades++;
    a.rr += t.rr || 0;

    // Duration (Estimate based on updatedAt - createdAt if possible, else random bucket for demo)
    // Assuming createdAt and updatedAt exist for duration
    const durationMs = new Date(t.updatedAt || t.createdAt).getTime() - new Date(t.createdAt).getTime();
    let durationBucket = "0-1h";
    if (durationMs > 3600000 && durationMs <= 14400000) durationBucket = "1-4h";
    else if (durationMs > 14400000 && durationMs <= 86400000) durationBucket = "4-24h";
    else if (durationMs > 86400000) durationBucket = ">24h";
    
    if (!durationMap.has(durationBucket)) durationMap.set(durationBucket, { name: durationBucket, count: 0 });
    durationMap.get(durationBucket).count++;

    // Performance (Monthly cumulative)
    const d = new Date(t.createdAt);
    const m = months[d.getMonth()];
    cumulativeRR += (t.rr || 0);
    cumulativePoints += (t.points || 0);
    monthlyMap.set(m, { name: m, rr: cumulativeRR, points: cumulativePoints });
  });

  // Re-map performance data in order
  for (const m of months) {
    if (monthlyMap.has(m)) {
      performanceData.push(monthlyMap.get(m));
    }
  }

  const providers = Array.from(providerMap.values()).map(p => ({
    ...p,
    winRate: p.total > 0 ? (p.wins / p.total) * 100 : 0
  })).sort((a, b) => b.rr - a.rr);

  return NextResponse.json({
    winLossData: [
      { name: 'Wins', value: wins, color: '#10B981' },
      { name: 'Losses', value: losses, color: '#EF4444' }
    ],
    buySellData: [
      { name: 'BUY', value: buyCount, color: '#10B981' },
      { name: 'SELL', value: sellCount, color: '#F43F5E' }
    ],
    assetData: Array.from(assetMap.values()).sort((a, b) => b.trades - a.trades).slice(0, 5), // top 5
    durationData: Array.from(durationMap.values()),
    providers,
    performanceData
  });
});
