const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('signal')
        .setDescription('ส่งสัญญาณเทรดเข้าห้อง (เฉพาะแอดมิน)')
        .addStringOption(option => option.setName('pair').setDescription('คู่เทรด เช่น XAUUSD').setRequired(true)
            .addChoices(
                { name: 'XAUUSD', value: 'XAUUSD' },
                { name: 'BTCUSD', value: 'BTCUSD' },
                { name: 'NASDAQ', value: 'NASDAQ' }
            )
        )
        .addStringOption(option => option.setName('type').setDescription('ทิศทางออเดอร์').setRequired(true)
            .addChoices({ name: '🟢 BUY', value: 'BUY' }, { name: '🔴 SELL', value: 'SELL' })
        )
        .addStringOption(option => option.setName('entry').setDescription('ราคาเข้า (Entry)').setRequired(true))
        .addStringOption(option => option.setName('sl').setDescription('Stop Loss').setRequired(true))
        .addStringOption(option => option.setName('full_tp').setDescription('FULL TP (กรอกเอง)').setRequired(true))
        .addStringOption(option => option.setName('tp1').setDescription('Take Profit 1').setRequired(false)
            .addChoices(
                { name: '600 point', value: '600 point' },
                { name: '1000 point', value: '1000 point' },
                { name: '1500 point', value: '1500 point' },
                { name: '2000 point', value: '2000 point' },
                { name: '3000 point', value: '3000 point' }
            )
        )
        .addStringOption(option => option.setName('tp2').setDescription('Take Profit 2').setRequired(false)
            .addChoices(
                { name: '600 point', value: '600 point' },
                { name: '1000 point', value: '1000 point' },
                { name: '1500 point', value: '1500 point' },
                { name: '2000 point', value: '2000 point' },
                { name: '3000 point', value: '3000 point' }
            )
        )
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
        const full_tp = interaction.options.getString('full_tp');
        const tp1 = interaction.options.getString('tp1');
        const tp2 = interaction.options.getString('tp2');
        const reason = interaction.options.getString('reason') || 'วิเคราะห์ตามโครงสร้างราคาปัจจุบัน';
        const chartImage = interaction.options.getAttachment('chart');

        const embed = new EmbedBuilder()
            .setColor('#ffeb3b')
            .setTitle(`⚡ SIGNAL ALERT: ${pair}`)
            .setDescription(`> 📊 **วิเคราะห์แนวโน้ม:**\n> ${reason}`)
            .addFields(
                { name: '📍 Action', value: `**${type}**`, inline: true },
                { name: '🎯 Entry', value: `**${entry}**`, inline: true },
                { name: '🛑 Stop Loss (SL)', value: `**${sl}**`, inline: true }
            );

        if (tp1) embed.addFields({ name: '✅ TP1', value: `**${tp1}**`, inline: true });
        if (tp2) embed.addFields({ name: '✅ TP2', value: `**${tp2}**`, inline: true });
        embed.addFields({ name: '🚀 FULL TP', value: `**${full_tp}**`, inline: true });

        embed.setTimestamp()
             .setFooter({ text: 'VIP Trade • การลงทุนมีความเสี่ยง', iconURL: interaction.guild.iconURL() });

        if (chartImage) embed.setImage(chartImage.url);

        // แท็กยศที่ต้องการ (ดึง ID จาก VIP_ROLE_ID ใน .env)
        await interaction.reply({ 
            content: `<@&${process.env.VIP_ROLE_ID}> ⚡ สัญญาณเทรดใหม่มาแล้วครับ!`,
            embeds: [embed] 
        });
    }
};