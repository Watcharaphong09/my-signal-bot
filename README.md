# Discord Premium Signal Bot - Comprehensive Overview

This document provides a complete summary of the Discord Signal Bot's features, architecture, and usage instructions. It is designed to give a comprehensive overview of the system for analysis, feature expansion, or identifying strengths and weaknesses.

## 🌟 Core Features & Functionality

### 1. Advanced Signal Distribution System (`/signal`)
The core feature of the bot is to distribute professional-grade trading signals to VIP members.
- **Workflow**:
  1. An Admin uses the `/signal` command, selecting the Asset (e.g., XAUUSD, EURUSD, BTCUSD) and Direction (BUY/SELL).
  2. A popup Modal appears, requiring the Admin to input the Entry price, Stop Loss (SL), and Take Profit 1 (TP1). TP2 and Full TP are optional.
  3. The bot generates a premium, color-coded Discord Embed and pings the VIP role (`<@&VIP_ROLE_ID>`).
  4. The signal is automatically saved to a MongoDB database (collection: `TradeLogs`).
  5. **Provider Tracking**: The bot automatically records the Discord ID and Username of the Admin who provided the signal.

### 2. Interactive Trade Management (Admin Buttons)
Attached to every signal message are interactive buttons that allow Admins to manage the trade in real-time. Only Admins can click these buttons.
- **Available Actions**:
  - `🎯 TP1`, `🎯 TP2`, `🚀 Full TP`: Marks the trade as hitting a specific Take Profit target.
  - `🛑 Hit SL`: Marks the trade as hitting the Stop Loss.
  - `🔔 แจ้ง BE`: Sends an alert to VIPs that the trade has been moved to Break Even (ทุนรอด), updating the embed without closing the trade.
  - `🛡️ BE`: Marks the trade as closed at Break Even (0 points, 0 RR).
  - `⏹️ Close`: Opens a modal for a "Manual Close," allowing the Admin to input the exact closing price to calculate custom profit/loss.
  - `❌ ยกเลิกออเดอร์`: Cancels a pending order, graying out the embed.
- **Automated Calculations**: When a trade is closed via a button, the bot automatically calculates:
  - **Points**: The profit/loss in points based on the asset multiplier (e.g., XAUUSD $1 = 100 points, Forex 1 pip = 10 points).
  - **Risk-Reward (RR)**: Calculates the achieved RR based on the initial risk (Entry - SL).
- **Automated Updates**: Clicking a button edits the original message embed to show the final Result (Status, Points, RR), disables the buttons to prevent duplicate clicks, and sends a follow-up reply in the channel to notify VIPs.

### 3. Weekly Statistics System (`/stats`)
A command to generate a beautiful summary of the week's trading performance.
- **Timezone Accuracy**: The start of the week (Monday 00:00:00) is strictly calculated using Thailand Time (UTC+7) to ensure accurate reporting regardless of where the bot is hosted.
- **Data Included**: 
  - Fetches all trades created in the current week.
  - Also fetches any trades from previous weeks that are still `ON GOING` (isClosed: false).
- **Calculations**: Displays Total Trades, Wins, Losses, Ongoing trades, Win Rate (%), Net Points, and Net RR.

### 4. Database Maintenance (`/clearstats`)
An Admin-only command to clean up the database.
- **Granular Deletion**: Admins can use a dropdown menu to delete specific types of trades:
  - `ALL`: Deletes everything.
  - `SL`: Deletes only trades that hit Stop Loss.
  - `TP`, `TP1`, `FULLTP`: Deletes specific Take Profit trades.
  - `ON GOING`: Deletes trades that are still running.

### 5. Automated VIP Subscription Management
The bot features a background cron job that runs daily (`0 0 * * *`) to manage VIP subscriptions.
- **Expiration Check**: Checks the database (`Users` collection) for expired VIPs.
- **Actions Taken**:
  - If expired: Automatically removes the VIP role from the user, sends them a DM, and logs the action in a designated `#bot-log` channel.
  - If expiring in 3 days: Sends a warning DM to the user to remind them to renew, and logs the warning.

## 🛠️ Technical Architecture

- **Language & Library**: Node.js, discord.js (v14)
- **Database**: MongoDB (via Mongoose)
- **Database Collections**:
  - `TradeLog`: Stores `messageId` (unique), `asset`, `direction`, `entry`, `sl`, `tp1`, `tp2`, `fullTp`, `status`, `points`, `rr`, `isClosed`, `createdAt`, `providerId`, `providerName`.
  - `User`: Stores VIP subscription data (`discordId`, `expireDate`, `status`, `notified3Days`).
- **Scheduling**: `node-cron` for the daily expiration checks.
- **Web Server**: Express.js is included to create a simple HTTP server (`/`), ensuring the bot stays alive on cloud hosting platforms like Render.

## 🚀 How to Use (Commands)

1. **`/signal`**:
   - Usage: `/signal asset:[Asset] direction:[BUY/SELL]`
   - Permission: Admin Only
   - Action: Opens the input modal for pricing.
2. **`/stats`**:
   - Usage: `/stats`
   - Permission: Admin Only
   - Action: Displays the weekly performance summary.
3. **`/clearstats`**:
   - Usage: `/clearstats status:[Optional Filter]`
   - Permission: Admin Only
   - Action: Deletes trade logs based on the selected filter.

---
*Note: This document encapsulates the current state of the bot. It is optimized for prompt engineering and AI analysis.*
