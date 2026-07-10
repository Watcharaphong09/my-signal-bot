const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('approve')
        .setDescription('อนุมัติยศ VIP และตั้งวันหมดอายุ (เฉพาะ Admin)')
        .addUserOption(option => option.setName('user').setDescription('เลือกสมาชิก').setRequired(true))
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('ระบุจำนวนวัน (เช่น 30, 7, หรือ 0)')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // ... (ส่วนบนของโค้ดเหมือนเดิม) ...

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');
        const roleId = process.env.VIP_ROLE_ID;

        // 1. ค้นหาข้อมูลเดิมใน Database ก่อน
        let userData = await User.findOne({ discordId: targetUser.id });
        
        const now = new Date();
        let newExpireDate;

        // 2. เช็คลอจิกการทบวัน
        if (userData && userData.expireDate > now) {
            // กรณีที่ 1: ต่ออายุก่อนหมดเวลา (มีของเดิม และของเดิมยังไม่หมดอายุ)
            // ให้นับต่อจาก "วันหมดอายุเดิม"
            newExpireDate = new Date(userData.expireDate);
        } else {
            // กรณีที่ 2: เพิ่งสมัครครั้งแรก หรือ ขาดต่ออายุไปแล้ว (ของเดิมหมดอายุไปแล้ว)
            // ให้นับใหม่จาก "วันนี้"
            newExpireDate = new Date(now);
        }

        // 3. นำวันที่ตั้งต้น มาบวกเพิ่มด้วยจำนวนวันที่แอดมินใส่เข้ามา (เช่น +30 วัน)
        newExpireDate.setDate(newExpireDate.getDate() + duration);

        // 4. บันทึกลง Database
        if (userData) {
            userData.expireDate = newExpireDate; // อัปเดตวันหมดอายุใหม่ที่ทบแล้ว
            userData.renewCount += 1;
            userData.status = 'active';
            await userData.save();
        } else {
            userData = new User({ 
                discordId: targetUser.id, 
                roleId: roleId, 
                expireDate: newExpireDate 
            });
            await userData.save();
        }

        const member = await interaction.guild.members.fetch(targetUser.id);
        await member.roles.add(roleId);

        const embed = new EmbedBuilder()
            .setColor('#00ff9f')
            .setTitle('✅ อนุมัติสถานะ VIP เรียบร้อย')
            .setDescription(`เพิ่มสถานะให้ <@${targetUser.id}> เป็นเวลา ${duration} วัน`)
            .addFields(
                { name: '📅 วันหมดอายุใหม่ (ทบวันให้แล้ว)', value: `<t:${Math.floor(newExpireDate.getTime() / 1000)}:F>` },
                { name: '🔄 สะสมการต่ออายุ', value: `${userData.renewCount} ครั้ง` }
            );

        await interaction.reply({ embeds: [embed] });
    }
};