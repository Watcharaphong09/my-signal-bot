require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('🍃 Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB Connection Error:', err));

client.once('ready', () => {
    console.log(`🤖 Bot is online as ${client.user.tag}`);
    startCronJobs();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'เกิดข้อผิดพลาดในการรันคำสั่งนี้!', ephemeral: true });
    }
});

// ⏳ ระบบเช็ควันหมดอายุอัตโนมัติ
function startCronJobs() {
    // 🌟 เปลี่ยนเป็น '* * * * *' ชั่วคราว เพื่อให้บอทสแกนทุกๆ 1 นาที (เทสต์เสร็จค่อยแก้กลับเป็น '0 0 * * *')
    cron.schedule('* * * * *', async () => {
        console.log('⏳ Running membership expiration checks (1-minute interval)...');
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);

        const activeUsers = await User.find({ status: 'active' });
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) return;

        for (const user of activeUsers) {
            const expireDate = new Date(user.expireDate);

            // 1. เช็คหมดอายุแล้วจริง -> ยึดยศออกและส่ง Log
            if (expireDate <= today) {
                user.status = 'expired';
                await user.save();
                
                try {
                    // 🌟 1. ดึงข้อมูลสมาชิกและทำการดึงยศ VIP ออก (จุดที่หายไป)
                    const member = await guild.members.fetch(user.discordId);
                    await member.roles.remove(process.env.VIP_ROLE_ID); 
                    
                    // 🌟 2. แจ้งเตือนลูกค้าผ่าน DM (ถ้าไม่ต้องการให้ลบบรรทัดนี้ออก)
                    try {
                        const expireDMEmbed = new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ แจ้งเตือน: สถานะ VIP หมดอายุ')
                            .setDescription('> สถานะสมาชิก VIP ของคุณหมดอายุแล้วครับ ระบบได้ทำการดึงยศ VIP ออกเรียบร้อย\n\n**หากต้องการรับ Signal และเข้าถึงห้อง VIP ต่อ สามารถติดต่อแอดมินเพื่อต่ออายุได้เลยครับ 🙏**')
                            .setTimestamp()
                            .setFooter({ text: 'Signal Bot • หมดอายุการใช้งาน' });
                        await member.send({ embeds: [expireDMEmbed] });
                    } catch (dmErr) {
                        console.log(`ไม่สามารถส่ง DM หา ${user.discordId} ได้`);
                    }

                    // 🌟 3. ส่ง Log เข้าห้อง #bot-log
                    const logChannel = await guild.channels.fetch(process.env.LOG_CHANNEL_ID);
                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setColor('#ff3333')
                            .setTitle('🔴 สมาชิกหมดอายุ')
                            .setDescription(`ระบบทำการดึงยศ VIP ของ <@${user.discordId}> เรียบร้อยแล้ว`)
                            .setTimestamp();
                        await logChannel.send({ embeds: [logEmbed] });
                    }
                } catch (err) {
                    console.log(`เกิดข้อผิดพลาดในการจัดการ ID ${user.discordId}:`, err.message);
                }
            } 
            // 2. เช็คแจ้งเตือนล่วงหน้า 3 วัน
            else if (
                !user.notified3Days &&
                expireDate.getDate() === threeDaysFromNow.getDate() &&
                expireDate.getMonth() === threeDaysFromNow.getMonth() &&
                expireDate.getFullYear() === threeDaysFromNow.getFullYear()
            ) {
                try {
                    const member = await guild.members.fetch(user.discordId);
                    const warnEmbed = new EmbedBuilder()
                        .setColor('#ffaa00')
                        .setTitle('⚠️ แจ้งเตือน: สมาชิก VIP ของคุณใกล้หมดอายุ')
                        .setDescription('> แพ็กเกจ VIP ของคุณจะหมดอายุในอีก **3 วัน**\n\nรีบต่ออายุก่อนพลาดจุดเข้าสำคัญนะครับ 🚀')
                        .setTimestamp()
                        .setFooter({ text: 'Signal Bot • แจ้งเตือนล่วงหน้า' });
                    
                    try {
                        await member.send({ embeds: [warnEmbed] });
                        // อัปเดตสถานะว่าแจ้งเตือนแล้วเพื่อไม่ให้สแปม
                        user.notified3Days = true;
                        await user.save();
                    } catch (dmErr) {
                        console.log(`ไม่สามารถส่ง DM แจ้งเตือน 3 วัน หา ${user.discordId} ได้`);
                    }

                    // 🌟 ส่ง Log แจ้งเตือน 3 วันเข้าห้อง #bot-log
                    const logChannel = await guild.channels.fetch(process.env.LOG_CHANNEL_ID);
                    if (logChannel) {
                        const logWarnEmbed = new EmbedBuilder()
                            .setColor('#ffff00')
                            .setTitle('⚠️ สมาชิกใกล้หมดอายุ (3 วัน)')
                            .setDescription(`ระบบได้ส่งแจ้งเตือน 3 วันให้ <@${user.discordId}> เรียบร้อยแล้ว`)
                            .setTimestamp();
                        await logChannel.send({ embeds: [logWarnEmbed] });
                    }
                } catch (err) {
                    console.log(`ไม่สามารถจัดการแจ้งเตือน 3 วันให้ ${user.discordId} ได้`, err);
                }
            }
        }
    });
}

// ใส่โค้ดทำ HTTP Server เล็กๆ เผื่อกรณีใช้บริการรันบอทคลาวด์ฟรี (Render) เพื่อให้โฮสต์ทักมาเช็คสถานะได้
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is Alive!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server is ready.'));

client.login(process.env.DISCORD_TOKEN);