require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');
const mongoose = require('mongoose');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const TradeLog = require('./models/TradeLog');

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
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'เกิดข้อผิดพลาดในการรันคำสั่งนี้!', ephemeral: true });
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'signal_modal') {
            const asset = interaction.fields.getTextInputValue('assetInput');
            const entry = interaction.fields.getTextInputValue('entryInput');
            const sl = interaction.fields.getTextInputValue('slInput');
            const tp = interaction.fields.getTextInputValue('tpInput');
            let image = '';
            try {
                image = interaction.fields.getTextInputValue('imageInput');
            } catch (e) {} // It's not required, might throw error if not present depending on djs version

            const embed = new EmbedBuilder()
                .setColor('#00ff9f') // Premium Neon Green
                .setTitle(`⚡ SIGNAL ALERT: ${asset}`)
                .addFields(
                    { name: '🎯 Entry', value: `**${entry}**`, inline: true },
                    { name: '🛑 Stop Loss (SL)', value: `**${sl}**`, inline: true },
                    { name: '🚀 Take Profit', value: `**${tp}**`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'VIP Trade • การลงทุนมีความเสี่ยง', iconURL: interaction.guild?.iconURL() || null });
            
            if (image) {
                try { embed.setImage(image); } catch (e) { console.log('Invalid image URL provided'); }
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('btn_tp1').setLabel('🎯 TP1').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('btn_tp2').setLabel('🎯 TP2').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('btn_fulltp').setLabel('🚀 Full TP').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('btn_sl').setLabel('🛑 Hit SL').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('btn_be').setLabel('🛡️ BE').setStyle(ButtonStyle.Secondary)
            );

            const sentMessage = await interaction.reply({ 
                content: `<@&${process.env.VIP_ROLE_ID}> ⚡ สัญญาณเทรดใหม่มาแล้วครับ!`,
                embeds: [embed],
                components: [row],
                fetchReply: true
            });

            const tradeLog = new TradeLog({
                messageId: sentMessage.id,
                asset: asset
            });
            await tradeLog.save();

        } else if (interaction.customId.startsWith('result_modal_')) {
            const parts = interaction.customId.split('_');
            const resultType = parts[2]; // tp1, tp2, fulltp, sl, be
            const messageId = parts.slice(3).join('_'); // Get messageId

            const pointsStr = interaction.fields.getTextInputValue('pointsInput');
            const rrStr = interaction.fields.getTextInputValue('rrInput');
            const points = parseFloat(pointsStr) || 0;
            const rr = parseFloat(rrStr) || 0;

            const tradeLog = await TradeLog.findOne({ messageId });
            if (!tradeLog) {
                return interaction.reply({ content: 'ไม่พบข้อมูล Signal นี้ในระบบ Database', ephemeral: true });
            }

            const statusMap = {
                'tp1': 'TP1',
                'tp2': 'TP2',
                'fulltp': 'Full TP',
                'sl': 'SL',
                'be': 'BE'
            };
            tradeLog.status = statusMap[resultType];
            tradeLog.points = points;
            tradeLog.rr = rr;
            await tradeLog.save();

            const message = await interaction.channel.messages.fetch(messageId);
            const embed = EmbedBuilder.from(message.embeds[0]);
            
            let color = '#00ff9f'; // Default Green
            if (resultType === 'sl') color = '#ff0000'; // Red
            else if (resultType === 'be') color = '#808080'; // Gray

            embed.setColor(color);
            embed.addFields({ 
                name: '📊 Result', 
                value: `Status: **${tradeLog.status}**\nPoints: **${points > 0 ? '+' : ''}${points}**\nRR: **${rr > 0 ? '+' : ''}${rr}**`, 
                inline: false 
            });

            // Disable the clicked button, keep others active or disable all? Let's disable the clicked one.
            const components = message.components;
            const newComponents = components.map(row => {
                return new ActionRowBuilder().addComponents(
                    row.components.map(c => {
                        const btn = ButtonBuilder.from(c);
                        if (c.customId === `btn_${resultType}`) {
                            btn.setDisabled(true);
                        }
                        return btn;
                    })
                );
            });

            await message.edit({ embeds: [embed], components: newComponents });
            await interaction.reply({ content: 'อัปเดตสถานะสำเร็จ!', ephemeral: true });
        }
    } else if (interaction.isButton()) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'คุณไม่มีสิทธิ์ใช้งานปุ่มนี้!', ephemeral: true });
        }

        if (interaction.customId.startsWith('btn_')) {
            const btnType = interaction.customId.split('_')[1]; // tp1, sl, etc.
            
            const modal = new ModalBuilder()
                .setCustomId(`result_modal_${btnType}_${interaction.message.id}`)
                .setTitle('📊 ระบุผลประกอบการ');

            const pointsInput = new TextInputBuilder()
                .setCustomId('pointsInput')
                .setLabel('Points (e.g. 500, -200, 0)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const rrInput = new TextInputBuilder()
                .setCustomId('rrInput')
                .setLabel('RR (e.g. 1.5, -1, 0)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(pointsInput),
                new ActionRowBuilder().addComponents(rrInput)
            );

            await interaction.showModal(modal);
        }
    }
});

// ⏳ ระบบเช็ควันหมดอายุอัตโนมัติ
function startCronJobs() {
    // 🌟 เปลี่ยนเป็น '* * * * *' ชั่วคราว เพื่อให้บอทสแกนทุกๆ 1 นาที (เทสต์เสร็จค่อยแก้กลับเป็น '0 0 * * *')
    cron.schedule('0 0 * * *', async () => {
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