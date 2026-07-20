import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TradeLog from "@/models/TradeLog";
import { apiHandler } from "@/lib/api-handler";

export const GET = apiHandler(async () => {
  await connectToDatabase();

  const [totalTrades, activeTrades, closedTrades] = await Promise.all([
    TradeLog.countDocuments(),
    TradeLog.countDocuments({ isClosed: false }),
    TradeLog.find({ isClosed: true }),
  ]);

  let wins = 0;
  let netRR = 0;
  let netPoints = 0;

  closedTrades.forEach((trade) => {
    if (trade.rr > 0 || trade.points > 0 || trade.status === "WIN" || trade.status.includes("TP")) {
      wins++;
    }
    netRR += trade.rr || 0;
    netPoints += trade.points || 0;
  });

  const winRate = closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : 0;

  return NextResponse.json({
    totalTrades,
    activeTrades,
    winRate: Number(winRate.toFixed(1)),
    netRR: Number(netRR.toFixed(2)),
    netPoints: Number(netPoints.toFixed(0)),
  });
});
