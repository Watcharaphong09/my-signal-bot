const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const TradeLog = require('../models/TradeLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('ดูสรุปผลประกอบการเทรดประจำสัปดาห์')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            // Get current time and convert to Thailand time (UTC+7)
            const nowUTC = new Date();
            const nowTH = new Date(nowUTC.getTime() + (7 * 60 * 60 * 1000));
            
            // Calculate start of the week (Monday) in Thailand time
            const firstTH = nowTH.getUTCDate() - nowTH.getUTCDay() + (nowTH.getUTCDay() === 0 ? -6 : 1);
            const startOfWeekTH = new Date(Date.UTC(nowTH.getUTCFullYear(), nowTH.getUTCMonth(), firstTH, 0, 0, 0, 0));
            
            // Convert back to UTC for MongoDB query
            const startOfWeek = new Date(startOfWeekTH.getTime() - (7 * 60 * 60 * 1000));

            // Fetch trades for this week OR any ongoing trades from previous weeks
            const trades = await TradeLog.find({
                $or: [
                    { createdAt: { $gte: startOfWeek } },
                    { isClosed: false }
                ]
            });

            let totalTrades = trades.length;
            let wins = 0;
            let losses = 0;
            let ongoing = 0;
            let totalPoints = 0;
            let totalRR = 0;

            trades.forEach(trade => {
                if (!trade.isClosed) {
                    ongoing++;
                } else if (trade.points > 0) {
                    wins++;
                } else if (trade.points < 0) {
                    losses++;
                }
                
                totalPoints += trade.points;
                totalRR += trade.rr;
            });

            // Calculate win rate (excluding ongoing and strict Break Evens (0 points))
            const completedTrades = wins + losses;
            const winRate = completedTrades > 0 ? ((wins / completedTrades) * 100).toFixed(2) : 0;

            // Format sign for points/rr
            totalPoints = parseFloat(totalPoints.toFixed(2));
            totalRR = parseFloat(totalRR.toFixed(2));
            const pointsStr = totalPoints > 0 ? `+${totalPoints}` : `${totalPoints}`;
            const rrStr = totalRR > 0 ? `+${totalRR}` : `${totalRR}`;

            const embed = new EmbedBuilder()
                .setColor('#00ff9f') // Premium Neon Green
                .setTitle('**Weekly Trading Summary**')
                .setDescription(
                    `**RESULT**\n` +
                    `• ${pointsStr} points | ${rrStr} RR\n\n` +
                    `**This Week's Summary**\n` +
                    `• Total Trades: ${totalTrades}\n` +
                    `• Wins: ${wins} (ON GOING: ${ongoing})\n` +
                    `• Losses: ${losses}\n\n` +
                    `**Win Rate: ${winRate}%**\n\n` +
                    `**Net Total**\n` +
                    `• Net Points: ${pointsStr}\n` +
                    `• Net RR: ${rrStr}`
                )
                .setTimestamp()
                .setFooter({ text: 'Signal Bot • Weekly Stats', iconURL: interaction.guild?.iconURL() || null });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching stats:', error);
            await interaction.editReply({ content: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ!' });
        }
    }
};
