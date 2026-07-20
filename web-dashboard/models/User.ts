import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  discordId: string;
  username: string;
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
  roleId: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  expireDate: { type: Date, required: true },
  renewCount: { type: Number, default: 1 },
  status: { type: String, default: 'active' },
  notified3Days: { type: Boolean, default: false }
});

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
