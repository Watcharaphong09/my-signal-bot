import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).sort({ startDate: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("API Error (Users):", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
