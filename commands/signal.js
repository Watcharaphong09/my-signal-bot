const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('signal')
        .setDescription('ส่งสัญญาณเทรดเข้าห้อง (เฉพาะแอดมิน)')
        .addStringOption(option => option.setName('pair').setDescription('คู่เทรด เช่น XAUUSD').setRequired(true))
        .addStringOption(option => option.setName('type').setDescription('ทิศทางออเดอร์').setRequired(true)
            .addChoices({ name: '🟢 BUY', value: 'BUY' }, { name: '🔴 SELL', value: 'SELL' })
        )
        .addStringOption(option => option.setName('entry').setDescription('ราคาเข้า (Entry)').setRequired(true))
        .addStringOption(option => option.setName('sl').setDescription('Stop Loss').setRequired(true))
        .addStringOption(option => option.setName('tp').setDescription('Take Profit').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('เหตุผลประกอบแนวคิด').setRequired(false))
        .addAttachmentOption(option => option.setName('chart').setDescription('แนบรูปกราฟประกอบ').setRequired(false))
        // 🔒 ล็อกคำสั่งนี้ให้เฉพาะคนที่มีสิทธิ์ Administrator เท่านั้นถึงจะเห็นและใช้งานได้
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // (ไม่ต้องเขียนโค้ดเช็คยศแล้ว ให้รับค่าและส่ง Embed ได้เลย)
        const pair = interaction.options.getString('pair');
        const type = interaction.options.getString('type');
        const entry = interaction.options.getString('entry');
        const sl = interaction.options.getString('sl');
        const tp = interaction.options.getString('tp');
        const reason = interaction.options.getString('reason') || 'วิเคราะห์ตามโครงสร้างราคาปัจจุบัน';
        const chartImage = interaction.options.getAttachment('chart');

        const embed = new EmbedBuilder()
            .setColor('#ffeb3b')
            .setTitle(`⚡ SIGNAL ALERT: ${pair}`)
            .addFields(
                { name: '📍 Action', value: `**${type}**`, inline: true },
                { name: '🎯 Entry', value: `${entry}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '🛑 Stop Loss (SL)', value: `${sl}`, inline: true },
                { name: '✅ Take Profit (TP)', value: `${tp}`, inline: true },
                { name: '📝 Analysis Note', value: `${reason}` }
            )
            .setTimestamp()
            .setFooter({ text: '@VIP Trade at your own risk • การลงทุนมีความเสี่ยง เป็นแค่การแชร์มุมมอง' });

        if (chartImage) embed.setImage(chartImage.url);

        // แท็กยศที่ต้องการ (ดึง ID จาก VIP_ROLE_ID ใน .env)
        await interaction.reply({ 
            content: `<@&${process.env.VIP_ROLE_ID}> ⚡ สัญญาณเทรดใหม่มาแล้วครับ!`,
            embeds: [embed] 
        });
    }
};