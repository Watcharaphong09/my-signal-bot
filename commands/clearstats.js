const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const TradeLog = require('../models/TradeLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearstats')
        .setDescription('Clear all trade logs for the new week (Admin Only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await TradeLog.deleteMany({});
        
        const embed = new EmbedBuilder()
            .setColor('#00ff9f')
            .setDescription('✅ Successfully cleared all trade records. The database is ready for the new week!');
            
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    },
};
