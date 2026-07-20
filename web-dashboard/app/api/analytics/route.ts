import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TradeLog from "@/models/TradeLog";

export async function GET() {
  try {
    await connectToDatabase();
    const trades = await TradeLog.find({ isClosed: true });

    // 1. Win/Loss Data
    let wins = 0;
    let losses = 0;
    trades.forEach(t => {
      const isWin = t.rr > 0 || t.points > 0 || t.status === "WIN" || String(t.status).includes("TP");
      if (isWin) wins++;
      else losses++;
    });

    // 2. Providers Leaderboard & List
    const providerMap = new Map();
    trades.forEach(t => {
      const pId = t.providerName || t.providerId || "Unknown";
      if (!providerMap.has(pId)) {
        providerMap.set(pId, { id: pId, name: pId, wins: 0, total: 0, rr: 0, points: 0, currentStreak: 0, maxStreak: 0 });
      }
      const p = providerMap.get(pId);
      p.total++;
      
      const isWin = t.rr > 0 || t.points > 0 || t.status === "WIN" || String(t.status).includes("TP");
      if (isWin) {
        p.wins++;
        p.currentStreak++;
        if (p.currentStreak > p.maxStreak) p.maxStreak = p.currentStreak;
      } else {
        p.currentStreak = 0;
      }
      
      p.rr += t.rr || 0;
      p.points += t.points || 0;
    });

    const providers = Array.from(providerMap.values()).map(p => ({
      ...p,
      winRate: p.total > 0 ? (p.wins / p.total) * 100 : 0
    })).sort((a, b) => b.rr - a.rr);

    // 3. Monthly Performance Data
    const monthlyMap = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Sort trades by date to calculate cumulative RR properly
    const sortedTrades = [...trades].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    let cumulativeRR = 0;
    sortedTrades.forEach(t => {
      const d = new Date(t.createdAt);
      const m = months[d.getMonth()];
      cumulativeRR += (t.rr || 0);
      monthlyMap.set(m, cumulativeRR);
    });

    const performanceData = Array.from(monthlyMap.entries()).map(([name, rr]) => ({
      name, rr: Number(rr.toFixed(2))
    }));

    // 4. Calendar Data (Daily)
    const calendarMap = new Map();
    sortedTrades.forEach(t => {
      const d = new Date(t.createdAt).toISOString().split('T')[0];
      if (!calendarMap.has(d)) calendarMap.set(d, { date: d, rr: 0, trades: 0 });
      const c = calendarMap.get(d);
      c.rr += (t.rr || 0);
      c.trades++;
    });

    const calendarData = Array.from(calendarMap.values());

    return NextResponse.json({
      winLossData: [
        { name: 'Wins', value: wins, color: '#10B981' },
        { name: 'Losses', value: losses, color: '#EF4444' }
      ],
      providers,
      performanceData,
      calendarData
    });

  } catch (error) {
    console.error("API Error (Analytics):", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
