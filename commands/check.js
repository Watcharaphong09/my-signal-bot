const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const User = require('../models/User');

module.exports = {
    // 🔓 ไม่มีการใส่ setDefaultMemberPermissions ดังนั้นสมาชิกทุกคนสามารถมองเห็นและใช้งานได้
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('ตรวจสอบสถานะวันหมดอายุของตัวเอง')
        .addUserOption(option => option.setName('user').setDescription('เลือกสมาชิกที่ต้องการเช็ค').setRequired(false)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const userData = await User.findOne({ discordId: targetUser.id });

        if (!userData) {
            return await interaction.reply({ content: `❌ ไม่พบข้อมูลสมาชิก VIP ของ <@${targetUser.id}> ในระบบ`, flags: MessageFlags.Ephemeral });
        }

        const today = new Date();
        const expireDate = new Date(userData.expireDate);
        const timeLeft = expireDate - today;
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
        
        // เช็คว่าหมดอายุหรือยังเพื่อเปลี่ยนสีสถานะ
        const isActive = daysLeft > 0;
        const statusText = isActive ? '🟢 ACTIVE' : '🔴 EXPIRED';
        const embedColor = isActive ? '#00ff9f' : '#ff3333';

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setAuthor({ name: `ข้อมูลสมาชิกระบบของ ${targetUser.username}`, iconURL: targetUser.displayAvatarURL() })
            .addFields(
                { name: 'สถานะปัจจุบัน', value: `**${statusText}**`, inline: true },
                { name: 'เวลาคงเหลือ', value: `**${isActive ? daysLeft : 0}** วัน`, inline: true },
                { name: 'จำนวนรอบการต่ออายุ', value: `**${userData.renewCount}** ครั้ง`, inline: true },
                { name: '📅 วันหมดอายุ', value: `<t:${Math.floor(expireDate.getTime() / 1000)}:F>` }
            )
            .setFooter({ text: 'ระบบจัดการสมาชิก Signal Bot' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};