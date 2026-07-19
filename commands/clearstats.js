const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const TradeLog = require('../models/TradeLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearstats')
        .setDescription('Clear trade logs (Admin Only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('status')
                .setDescription('เลือกประเภทไม้ที่ต้องการลบ')
                .setRequired(false)
                .addChoices(
                    { name: 'ALL (ทั้งหมด)', value: 'ALL' },
                    { name: 'SL (โดน SL)', value: 'SL' },
                    { name: 'TP (ชน TP ทุกระยะ)', value: 'TP' },
                    { name: 'TP1 (ชน TP1)', value: 'TP1' },
                    { name: 'FULLTP (ชน Full TP)', value: 'FULLTP' },
                    { name: 'ON GOING (กำลังวิ่ง)', value: 'ON GOING' }
                )
        ),
    async execute(interaction) {
        const statusOption = interaction.options.getString('status') || 'ALL';
        
        let query = {};
        let deletedMessage = '✅ Successfully cleared ALL trade records.';

        if (statusOption === 'SL') {
            query = { status: { $regex: /Hit SL/i } };
            deletedMessage = '✅ Successfully cleared all trades that hit SL 🛑.';
        } else if (statusOption === 'TP') {
            query = { status: { $regex: /TP Hit/i } };
            deletedMessage = '✅ Successfully cleared all trades that hit TP 🎯/🚀.';
        } else if (statusOption === 'TP1') {
            query = { status: { $regex: /TP1 Hit/i } };
            deletedMessage = '✅ Successfully cleared all trades that hit TP1 🎯.';
        } else if (statusOption === 'FULLTP') {
            query = { status: { $regex: /Full TP Hit/i } };
            deletedMessage = '✅ Successfully cleared all trades that hit Full TP 🚀.';
        } else if (statusOption === 'ON GOING') {
            query = { status: { $regex: /ON GOING/i } };
            deletedMessage = '✅ Successfully cleared all ON GOING trades.';
        }

        const result = await TradeLog.deleteMany(query);
        
        const embed = new EmbedBuilder()
            .setColor('#00ff9f')
            .setDescription(`${deletedMessage}\nDeleted **${result.deletedCount}** record(s).`);
            
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    },
};
