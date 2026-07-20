import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  discordId: string;
  username: string;
  password?: string;
  role: 'admin' | 'member';
  roleId: string;
  startDate: Date;
  expireDate: Date;
  renewCount: number;
  status: string;
  notified3Days: boolean;
}

const userSchema = new Schema<IUser>({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, default: 'Unknown User' },
  password: { type: String },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  roleId: { type: String }, // Made optional if admin is created manually
  startDate: { type: Date, default: Date.now },
  expireDate: { type: Date }, // Made optional
  renewCount: { type: Number, default: 1 },
  status: { type: String, default: 'active' },
  notified3Days: { type: Boolean, default: false }
});

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
