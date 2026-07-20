import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from web-dashboard directory
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') }); // fallback

// Basic User Schema for seeding
const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, default: 'Unknown User' },
  password: { type: String },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  status: { type: String, default: 'active' },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log("Admin user already exists. If you forgot the password, delete the user and re-run this script.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      discordId: 'admin-seed-' + Date.now(),
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
    
  } catch (error) {
    console.error("Failed to seed admin user:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
