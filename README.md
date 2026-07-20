# 🚀 Premium Discord Signal Bot & Analytics Dashboard

This project is a comprehensive **Trading Signal Management System** built for professional Discord communities. It consists of two main components:
1. **Discord Bot (Node.js/Discord.js)**: Distributes highly customizable trading signals, manages trades via interactive buttons, and automates VIP role subscriptions.
2. **Web Dashboard (Next.js/React)**: A secure, premium SaaS-style interface for administrators to analyze trading performance, track signal providers, and manage VIP members in real-time.

---

## 🤖 1. Discord Bot Core Features

### 📡 Advanced Signal Distribution System (`/signal`)
The core feature of the bot is to distribute professional-grade trading signals to VIP members.
- **Workflow**:
  1. An Admin uses the `/signal` command, selecting the Asset (e.g., XAUUSD, EURUSD, BTCUSD) and Direction (BUY/SELL).
  2. A popup Modal appears, requiring the Admin to input the Entry price, Stop Loss (SL), and Take Profit 1 (TP1). TP2 and Full TP are optional.
  3. The bot generates a premium, color-coded Discord Embed and pings the VIP role (`<@&VIP_ROLE_ID>`).
  4. The signal is automatically saved to a **MongoDB database** (`TradeLogs` collection).
  5. **Provider Tracking**: The bot automatically records the Discord ID and Username of the Admin who provided the signal for leaderboard ranking.

### 🎮 Interactive Trade Management (Admin Buttons)
Attached to every signal message are interactive buttons that allow Admins to manage the trade in real-time. Only Admins can click these buttons.
- **Available Actions**:
  - `🎯 TP1`, `🎯 TP2`, `🚀 Full TP`: Marks the trade as hitting a specific Take Profit target.
  - `🛑 Hit SL`: Marks the trade as hitting the Stop Loss.
  - `🔔 แจ้ง BE`: Sends an alert to VIPs that the trade has been moved to Break Even (ทุนรอด), updating the embed without closing the trade.
  - `🛡️ BE`: Marks the trade as closed at Break Even (0 points, 0 RR).
  - `⏹️ Close`: Opens a modal for a "Manual Close," allowing the Admin to input the exact closing price to calculate custom profit/loss.
  - `❌ ยกเลิกออเดอร์`: Cancels a pending order, graying out the embed.
- **Automated Calculations**: When a trade is closed via a button, the bot automatically calculates **Points** (profit/loss) and **Risk-Reward (RR)**.
- **Automated Updates**: Clicking a button edits the original message embed to show the final Result, disables the buttons, and sends a follow-up reply to notify VIPs.

### 📊 Weekly Statistics System (`/stats`)
A command to generate a beautiful summary of the week's trading performance.
- Calculates Total Trades, Wins, Losses, Ongoing trades, Win Rate (%), Net Points, and Net RR based on Thailand Time (UTC+7).

### 🧹 Database Maintenance (`/clearstats`)
An Admin-only command to clean up the database with granular deletion filters (`ALL`, `SL`, `TP`, `ON GOING`).

### 👑 Automated VIP Subscription Management
A background cron job runs daily (`0 0 * * *`) to manage VIP subscriptions.
- **Expiration Check**: Checks the `Users` collection for expired VIPs.
- **Actions Taken**: Automatically removes the VIP role, sends a DM, and logs the action. Also sends a 3-day warning DM prior to expiration.

---

## 💻 2. Premium Analytics Dashboard

The Web Dashboard is an internal administrative tool built with **Next.js (App Router)**, **React**, **TailwindCSS**, and **Framer Motion**. It provides a world-class UI inspired by Vercel, Linear, and Stripe.

### 🔒 Secure Authentication & User Management
- **Role-Based Access Control (RBAC)**: Support for Admin and Member roles via MongoDB.
- **Secure Authentication**: Username and password login encrypted using `bcryptjs`.
- **Custom JWT Edge Auth**: The entire dashboard is protected by an Edge Middleware using `jose` for fast, serverless JWT verification (stored in `HttpOnly` cookies).
- **Admin Seeding**: Easily initialize the first administrator using the provided `npm run seed:admin` script.

### 🎨 Ultra-Premium UI Architecture
- **Component Library**: A robust, custom-built UI kit (`Card`, `Badge`, `Button`, `Input`) utilizing `class-variance-authority` (CVA) for multiple styling variants.
- **Glassmorphism Design**: High-end styling inspired by modern SaaS applications with dynamic glow effects and fluid `framer-motion` animations.

### 📈 Live Trades & History
- **Live Trades**: View all currently active (`ON GOING`) signals across all providers in real-time, featuring interactive expansions and direct action buttons.
- **Trade History**: A robust data table with client-side pagination, sorting, status badges, and browser-based CSV exporting.

### 📊 Advanced Analytics & Statistics
- **Performance Overview**: Visualizes cumulative Net RR over time using responsive Area Charts (`recharts`).
- **Comprehensive Metrics**: Dive deep into Trade Duration, Buy vs Sell Ratios, Asset Volume distributions, and Win Rate donuts.

### 🏆 Provider Leaderboard
- **Rankings**: Automatically aggregates `TradeLogs` to rank all signal providers based on their Net Risk-Reward (RR).
- **Provider Stats**: Displays Win Rate, Total Signals, and Current Winning Streak (🔥) for each provider.

### 📅 Performance Calendar
- Maps closed trades onto a daily calendar grid, allowing administrators to visually identify profitable vs. unprofitable days at a glance.

### 👥 VIP Member Management
- Synchronizes with the bot's `Users` collection.
- Displays a searchable, sortable list of all Discord VIP subscribers, their Join Dates, Expiration Dates, and calculates whether their status is **Active** or **Expired**.

---

## 🛠️ Technical Stack

- **Bot Backend**: Node.js, discord.js (v14)
- **Dashboard Frontend**: Next.js 14+ (App Router), React, TailwindCSS
- **Database**: MongoDB (via Mongoose)
- **Authentication**: `jose` (JWT), `bcryptjs` (Password Hashing)
- **Data Fetching**: `@tanstack/react-query`
- **Charts**: `recharts`
- **Icons & UI**: `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`

## 🚀 Setup & Deployment

### 1. Bot Environment Variables (`.env`)
```env
TOKEN=your_discord_bot_token
MONGODB_URI=your_mongodb_connection_string
VIP_ROLE_ID=your_vip_role_id
LOG_CHANNEL_ID=your_log_channel_id
```

### 2. Dashboard Environment Variables (`web-dashboard/.env.local`)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_secure_random_string_min_32_chars
```

### 3. Initialize Admin Account
Navigate to the `web-dashboard` directory and run:
```bash
npm run seed:admin
```
*(This creates the default `admin` account with the password `admin123`)*

### 4. Run Development Server
```bash
npm run dev
```

*(Note: The Web Dashboard is fully optimized for 1-click deployment on Vercel).*
