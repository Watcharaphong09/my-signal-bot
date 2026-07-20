export interface User {
  _id: string;
  discordId: string;
  username: string;
  role: 'admin' | 'member';
  roleId: string;
  startDate: Date;
  expireDate: Date;
  renewCount: number;
  status: string;
  notified3Days: boolean;
}

export interface TradeLog {
  _id: string;
  tradeId: string;
  signalType: 'Scalping' | 'Run';
  messageId: string;
  providerId: string;
  providerName: string;
  asset: string;
  action: 'BUY' | 'SELL';
  entry: number;
  sl: number;
  tp1: number;
  tp2?: number;
  fullTp?: number;
  status: string;
  points: number;
  rr: number;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
