const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test-vip')
        .setDescription('ทดสอบระบบให้ยศ 1 นาที (แจ้งเตือนล่วงหน้า 30 วิ)')
        .addUserOption(option => option.setName('user').setDescription('เลือกสมาชิกที่ต้องการทดสอบ').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const roleId = process.env.VIP_ROLE_ID; 

        // ดึงข้อมูลสมาชิกในเซิร์ฟเวอร์
        const member = await interaction.guild.members.fetch(targetUser.id);

        // 1. ให้ยศ VIP ทันทีที่รันคำสั่ง
        await member.roles.add(roleId);

        // ส่งข้อความยืนยันในห้องแชท (ใช้ธีมดาร์กโทนตัดขอบสีเขียวสะท้อนแสง)
        const embedSuccess = new EmbedBuilder()
            .setColor('#00ff9f') 
            .setTitle('✅ เริ่มการทดสอบระบบ VIP 1 นาที')
            .setDescription(`ระบบได้ให้ยศ <@${targetUser.id}> เรียบร้อยแล้ว\nบอทจะทัก DM ไปเตือนเมื่อเหลือ 30 วินาที และดึงยศออกเมื่อครบ 1 นาที`);

        await interaction.reply({ embeds: [embedSuccess] });

        // 2. ตั้งเวลาแจ้งเตือนล่วงหน้า 30 วินาที (30,000 มิลลิวินาที)
        setTimeout(async () => {
            try {
                const warnEmbed = new EmbedBuilder()
                    .setColor('#00ff9f') 
                    .setTitle('⚠️ ทดสอบแจ้งเตือน: ใกล้หมดอายุ')
                    .setDescription(`แพ็กเกจ VIP ของคุณจะหมดอายุในอีก **30 วินาที** (นี่คือข้อความทดสอบ)`);
                
                try {
                    await member.send({ embeds: [warnEmbed] });
                } catch (dmErr) {
                    console.log(`ไม่สามารถส่ง DM เตือน 30 วิ หา ${targetUser.username} ได้`);
                }

                const logChannel = await interaction.guild.channels.fetch(process.env.LOG_CHANNEL_ID);
                if (logChannel) {
                    const logWarnEmbed = new EmbedBuilder()
                        .setColor('#ffff00')
                        .setTitle('⚠️ ทดสอบ: สมาชิกใกล้หมดอายุ (30 วินาที)')
                        .setDescription(`ระบบได้ส่งแจ้งเตือน 30 วินาทีให้ <@${targetUser.id}> เรียบร้อยแล้ว`)
                        .setTimestamp();
                    await logChannel.send({ embeds: [logWarnEmbed] });
                }
            } catch (err) {
                console.log(`เกิดข้อผิดพลาดในการส่งแจ้งเตือน 30 วิ หา ${targetUser.username}: ${err}`);
            }
        }, 30000);

        // 3. ตั้งเวลาดึงยศออกและแจ้งเตือนหมดเวลา เมื่อครบ 1 นาที (60,000 มิลลิวินาที)
        setTimeout(async () => {
            try {
                // ดึงยศออก
                await member.roles.remove(roleId);
                
                const expireEmbed = new EmbedBuilder()
                    .setColor('#ff0000') // เปลี่ยนเป็นขอบสีแดงเพื่อแจ้งเตือนว่าหมดเวลาแล้ว
                    .setTitle('❌ ทดสอบแจ้งเตือน: หมดอายุ')
                    .setDescription(`ระบบได้ทำการดึงยศ VIP ของคุณออกเรียบร้อยแล้ว (สิ้นสุดการทดสอบ 1 นาที)`);
                
                try {
                    await member.send({ embeds: [expireEmbed] });
                } catch (dmErr) {
                    console.log(`ไม่สามารถส่ง DM หมดเวลาหา ${targetUser.username} ได้`);
                }

                const logChannel = await interaction.guild.channels.fetch(process.env.LOG_CHANNEL_ID);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#ff3333')
                        .setTitle('🔴 ทดสอบ: สมาชิกหมดอายุ')
                        .setDescription(`ระบบทำการดึงยศ VIP ของ <@${targetUser.id}> เรียบร้อยแล้ว`)
                        .setTimestamp();
                    await logChannel.send({ embeds: [logEmbed] });
                }
            } catch (err) {
                console.log(`เกิดข้อผิดพลาดในการดึงยศหรือแจ้งเตือนหมดเวลาหา ${targetUser.username}: ${err}`);
            }
        }, 60000);
    }
};