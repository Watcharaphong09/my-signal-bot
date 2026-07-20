import mongoose, { Schema, Document } from "mongoose";

export interface ITradeLog extends Document {
  messageId: string;
  providerId: string;
  providerName: string;
  asset: string;
  direction: "BUY" | "SELL";
  entry?: number;
  sl?: number;
  tp1?: number;
  tp2?: number;
  fullTp?: number;
  status: string;
  points: number;
  rr: number;
  isClosed: boolean;
  createdAt: Date;
}

const tradeLogSchema = new Schema<ITradeLog>({
  messageId: { type: String, required: true, unique: true },
  providerId: { type: String, required: true, default: "unknown" },
  providerName: { type: String, default: "Unknown" },
  asset: { type: String, required: true },
  direction: { type: String, enum: ["BUY", "SELL"] },
  entry: { type: Number },
  sl: { type: Number },
  tp1: { type: Number },
  tp2: { type: Number },
  fullTp: { type: Number },
  status: { type: String, default: "ON GOING" },
  points: { type: Number, default: 0 },
  rr: { type: Number, default: 0 },
  isClosed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TradeLog || mongoose.model<ITradeLog>("TradeLog", tradeLogSchema);
