require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags } = require('discord.js');
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

function getMultiplier(asset) {
    if (['XAUUSD'].includes(asset)) return 100; // $1 = 100 points
    if (['EURUSD', 'GBPUSD'].includes(asset)) return 100000;
    return 1; // BTCUSD, US30, NASDAQ
}

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
            await interaction.reply({ content: 'เกิดข้อผิดพลาดในการรันคำสั่งนี้!', flags: MessageFlags.Ephemeral });
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('signal_modal_')) {
            const parts = interaction.customId.split('_');
            const asset = parts[2];
            const direction = parts[3];

            const entryStr = interaction.fields.getTextInputValue('entryInput');
            const slStr = interaction.fields.getTextInputValue('slInput');
            const tp1Str = interaction.fields.getTextInputValue('tp1Input');
            
            let tp2Str = null;
            try { tp2Str = interaction.fields.getTextInputValue('tp2Input'); } catch(e) {}
            
            let fullTpStr = null;
            try { fullTpStr = interaction.fields.getTextInputValue('fullTpInput'); } catch(e) {}

            const entry = parseFloat(entryStr);
            const sl = parseFloat(slStr);
            const tp1 = parseFloat(tp1Str);
            const tp2 = tp2Str ? parseFloat(tp2Str) : null;
            const fullTp = fullTpStr ? parseFloat(fullTpStr) : null;

            if (isNaN(entry) || isNaN(sl) || isNaN(tp1)) {
                return interaction.reply({ content: '❌ กรุณากรอกราคาเป็นตัวเลขเท่านั้น (Entry, SL, TP1)', flags: MessageFlags.Ephemeral });
            }

            const embedColor = direction === 'BUY' ? '#00ff9f' : '#ff3333';
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(`⚡ SIGNAL ALERT: ${asset} ${direction}`)
                .addFields(
                    { name: '🎯 Entry', value: `**${entry}**`, inline: true },
                    { name: '🛑 Stop Loss', value: `**${sl}**`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true }, // Spacer
                    { name: '🚀 TP1', value: `**${tp1}**`, inline: true }
                );

            if (tp2) embed.addFields({ name: '🚀 TP2', value: `**${tp2}**`, inline: true });
            if (fullTp) embed.addFields({ name: '🌕 Full TP', value: `**${fullTp}**`, inline: true });

            embed.setTimestamp()
                 .setFooter({ text: 'VIP Trade • การลงทุนมีความเสี่ยง', iconURL: interaction.guild?.iconURL() || null });
            
            // Check image cache
            if (interaction.client.imageCache && interaction.client.imageCache.has(interaction.user.id)) {
                const imageUrl = interaction.client.imageCache.get(interaction.user.id);
                try { embed.setImage(imageUrl); } catch (e) { console.log('Invalid image URL'); }
                interaction.client.imageCache.delete(interaction.user.id); // Clear cache after use
            }

            const row1 = new ActionRowBuilder();
            const row2 = new ActionRowBuilder();
            
            row1.addComponents(new ButtonBuilder().setCustomId('btn_tp1').setLabel('🎯 TP1').setStyle(ButtonStyle.Success));
            if (tp2) row1.addComponents(new ButtonBuilder().setCustomId('btn_tp2').setLabel('🎯 TP2').setStyle(ButtonStyle.Success));
            if (fullTp) row1.addComponents(new ButtonBuilder().setCustomId('btn_fulltp').setLabel('🚀 Full TP').setStyle(ButtonStyle.Success));
            
            row2.addComponents(new ButtonBuilder().setCustomId('btn_sl').setLabel('🛑 Hit SL').setStyle(ButtonStyle.Danger));
            row2.addComponents(new ButtonBuilder().setCustomId('btn_alertbe').setLabel('🔔 แจ้ง BE').setStyle(ButtonStyle.Secondary));
            row2.addComponents(new ButtonBuilder().setCustomId('btn_be').setLabel('🛡️ BE').setStyle(ButtonStyle.Secondary));
            row2.addComponents(new ButtonBuilder().setCustomId('btn_close').setLabel('⏹️ Close').setStyle(ButtonStyle.Primary));
            row2.addComponents(new ButtonBuilder().setCustomId('cancel_order').setLabel('❌ ยกเลิกออเดอร์').setStyle(ButtonStyle.Danger));

            const sentMessage = await interaction.reply({ 
                content: `<@&${process.env.VIP_ROLE_ID}> ⚡ สัญญาณเทรดใหม่มาแล้วครับ!`,
                embeds: [embed],
                components: [row1, row2],
                fetchReply: true
            });

            const tradeLog = new TradeLog({
                messageId: sentMessage.id,
                providerId: interaction.user.id,
                providerName: interaction.user.username,
                asset: asset,
                direction: direction,
                entry: entry,
                sl: sl,
                tp1: tp1,
                tp2: tp2,
                fullTp: fullTp,
                status: 'ON GOING'
            });
            await tradeLog.save();
        }
    } else if (interaction.isButton()) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'คุณไม่มีสิทธิ์ใช้งานปุ่มนี้!', flags: MessageFlags.Ephemeral });
        }

        if (interaction.customId === 'cancel_order') {
            const messageId = interaction.message.id;
            
            const tradeLog = await TradeLog.findOne({ messageId });
            if (!tradeLog) {
                return interaction.reply({ content: 'ไม่พบข้อมูล Signal นี้ในระบบ Database', flags: MessageFlags.Ephemeral });
            }

            if (tradeLog.isClosed) {
                return interaction.reply({ content: 'ออเดอร์นี้ถูกปิดไปแล้ว!', flags: MessageFlags.Ephemeral });
            }

            tradeLog.points = 0;
            tradeLog.rr = 0;
            tradeLog.status = "CANCELED";
            tradeLog.isClosed = true;
            await tradeLog.save();

            const message = await interaction.channel.messages.fetch(messageId);
            const embed = EmbedBuilder.from(message.embeds[0]);
            
            embed.setColor('#808080');

            const newFields = embed.data.fields.filter(f => f.name !== '📊 Result');
            newFields.push({ 
                name: '📊 Result', 
                value: `Status: **❌ CANCELED (ยกเลิกแผนเทรด)**\nPoints: **0**\nRR: **0R**`, 
                inline: false 
            });
            embed.setFields(newFields);

            const disabledComponents = message.components.map(row => {
                return new ActionRowBuilder().addComponents(
                    row.components.map(c => ButtonBuilder.from(c).setDisabled(true))
                );
            });

            await interaction.update({ embeds: [embed], components: disabledComponents });
            
            return interaction.channel.send({ 
                content: `<@&${process.env.VIP_ROLE_ID}> ❌ **UPDATE:** ยกเลิกแผนเทรดออเดอร์นี้นะครับ (Order Canceled - เคลียร์ Pending ได้เลย)`, 
                reply: { messageReference: messageId } 
            });
        }

        if (interaction.customId.startsWith('btn_')) {
            const btnType = interaction.customId.split('_')[1]; // tp1, tp2, fulltp, sl, be, close
            const messageId = interaction.message.id;
            
            const tradeLog = await TradeLog.findOne({ messageId });
            if (!tradeLog) {
                return interaction.reply({ content: 'ไม่พบข้อมูล Signal นี้ในระบบ Database', flags: MessageFlags.Ephemeral });
            }

            if (tradeLog.isClosed) {
                return interaction.reply({ content: 'ออเดอร์นี้ถูกปิดไปแล้ว!', flags: MessageFlags.Ephemeral });
            }

            if (btnType === 'alertbe') {
                const message = await interaction.channel.messages.fetch(messageId);
                const embed = EmbedBuilder.from(message.embeds[0]);
                
                let resultField = embed.data.fields.find(f => f.name === '📊 Result');
                if (resultField) {
                    if (!resultField.value.includes('(กันหน้าทุนแล้ว 🛡️)')) {
                        resultField.value = resultField.value.replace(/Status: \*\*(.*?)\*\*/, 'Status: **$1 (กันหน้าทุนแล้ว 🛡️)**');
                        // Also update embed fields
                        const newFields = embed.data.fields.map(f => f.name === '📊 Result' ? resultField : f);
                        embed.setFields(newFields);
                    }
                } else {
                    embed.addFields({
                        name: '📊 Result',
                        value: `Status: **${tradeLog.status} (กันหน้าทุนแล้ว 🛡️)**\nPoints: **0**\nRR: **0R**`,
                        inline: false
                    });
                }
                
                if (!tradeLog.status.includes('(กันหน้าทุนแล้ว 🛡️)')) {
                    tradeLog.status = `${tradeLog.status} (กันหน้าทุนแล้ว 🛡️)`;
                    await tradeLog.save();
                }
                
                await interaction.update({ embeds: [embed] });
                
                return interaction.channel.send({ 
                    content: `<@&${process.env.VIP_ROLE_ID}> 🛡️ **UPDATE:** ออเดอร์นี้กันหน้าทุน (Break Even) เรียบร้อยแล้วนะครับ ปล่อยรันต่อได้เลย!`, 
                    reply: { messageReference: interaction.message.id } 
                });
            }

            if (btnType === 'close') {
                const closeModal = new ModalBuilder()
                    .setCustomId(`close_modal_${messageId}`)
                    .setTitle('⏹️ Manual Close');
                
                const closePriceInput = new TextInputBuilder()
                    .setCustomId('closePrice')
                    .setLabel('Closing Price')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);
                
                closeModal.addComponents(new ActionRowBuilder().addComponents(closePriceInput));
                return interaction.showModal(closeModal);
            }

            const entry = tradeLog.entry;
            const sl = tradeLog.sl;
            const multiplier = getMultiplier(tradeLog.asset);
            const riskPoints = Math.abs(entry - sl) * multiplier;
            
            let statusText = '';
            let color = tradeLog.direction === 'BUY' ? '#00ff9f' : '#ff3333'; // Default to match direction
            let disableButtons = false;

            if (btnType === 'sl') {
                tradeLog.points = -riskPoints;
                tradeLog.rr = -1;
                statusText = 'Hit SL 🛑';
                color = '#ff3333';
                tradeLog.isClosed = true;
                disableButtons = true;
            } else if (btnType === 'be') {
                statusText = 'Break Even 🛡️';
                color = '#808080';
                tradeLog.isClosed = true;
                disableButtons = true;
            } else {
                // TP
                let tpPrice = 0;
                if (btnType === 'tp1') { tpPrice = tradeLog.tp1; statusText = 'TP1 Hit 🎯'; }
                if (btnType === 'tp2') { tpPrice = tradeLog.tp2; statusText = 'TP2 Hit 🎯'; }
                if (btnType === 'fulltp') { 
                    tpPrice = tradeLog.fullTp; 
                    statusText = 'Full TP Hit 🚀'; 
                    tradeLog.isClosed = true;
                    disableButtons = true;
                    color = '#00ff9f';
                }

                tradeLog.points = Math.abs(tpPrice - entry) * multiplier;
                tradeLog.rr = riskPoints > 0 ? (tradeLog.points / riskPoints) : 0;
            }

            tradeLog.rr = parseFloat(tradeLog.rr.toFixed(2));
            tradeLog.points = parseFloat(tradeLog.points.toFixed(2));
            tradeLog.status = statusText;
            
            await tradeLog.save();

            const message = await interaction.channel.messages.fetch(messageId);
            const embed = EmbedBuilder.from(message.embeds[0]);
            
            embed.setColor(color);
            
            // Overwrite existing Result field if any, else add new
            const newFields = embed.data.fields.filter(f => f.name !== '📊 Result');
            newFields.push({ 
                name: '📊 Result', 
                value: `Status: **${statusText}**\nPoints: **${tradeLog.points > 0 ? '+' : ''}${tradeLog.points}**\nRR: **${tradeLog.rr > 0 ? '+' : ''}${tradeLog.rr}R**`, 
                inline: false 
            });
            embed.setFields(newFields);

            let newComponents = message.components;
            if (disableButtons) {
                newComponents = message.components.map(row => {
                    return new ActionRowBuilder().addComponents(
                        row.components.map(c => ButtonBuilder.from(c).setDisabled(true))
                    );
                });
            }

            await message.edit({ embeds: [embed], components: newComponents });
            
            const channel = interaction.channel;
            await channel.send({ 
                content: `<@&${process.env.VIP_ROLE_ID}> ⚡ **UPDATE:** ${tradeLog.asset} ${statusText}`,
                reply: { messageReference: messageId }
            });
            
            await interaction.reply({ content: `✅ อัปเดตสถานะสำเร็จ`, flags: MessageFlags.Ephemeral });
        }
    } else if (interaction.isModalSubmit() && interaction.customId.startsWith('close_modal_')) {
        try {
            const messageId = interaction.customId.replace('close_modal_', '');
            
            const trade = await TradeLog.findOne({ messageId });
            if (!trade || trade.isClosed) {
                return interaction.reply({ content: '❌ ออเดอร์นี้ถูกปิดไปแล้วหรือไม่พบข้อมูล', flags: MessageFlags.Ephemeral });
            }

            const closePriceStr = interaction.fields.getTextInputValue('closePrice');
            const closePrice = parseFloat(closePriceStr);

            if (isNaN(closePrice)) {
                return interaction.reply({ content: '❌ กรุณากรอกราคาปิดเป็นตัวเลข', flags: MessageFlags.Ephemeral });
            }

            const entry = trade.entry;
            const sl = trade.sl;
            const multiplier = getMultiplier(trade.asset);
            const riskPoints = Math.abs(entry - sl) * multiplier;
            
            const priceDiff = trade.direction === 'BUY' ? closePrice - entry : entry - closePrice;
            trade.points = priceDiff * multiplier;
            trade.rr = riskPoints > 0 ? (trade.points / riskPoints) : 0;
            
            trade.rr = parseFloat(trade.rr.toFixed(2));
            trade.points = parseFloat(trade.points.toFixed(2));
            trade.status = 'Manual Close ⏹️';
            trade.isClosed = true;

            const message = await interaction.channel.messages.fetch(messageId);
            const newEmbed = EmbedBuilder.from(message.embeds[0]);
            
            const color = trade.points > 0 ? '#00ff9f' : (trade.points < 0 ? '#ff3333' : '#808080');
            newEmbed.setColor(color);
            
            const newFields = newEmbed.data.fields.filter(f => f.name !== '📊 Result');
            newFields.push({ 
                name: '📊 Result', 
                value: `Status: **${trade.status}**\nPoints: **${trade.points > 0 ? '+' : ''}${trade.points}**\nRR: **${trade.rr > 0 ? '+' : ''}${trade.rr}R**`, 
                inline: false 
            });
            newEmbed.setFields(newFields);

            await interaction.update({ embeds: [newEmbed], components: [] });
            
            await trade.save();
            
            await interaction.channel.send({
                content: `<@&${process.env.VIP_ROLE_ID}> 🛑 **MANUAL CLOSE:** ${trade.asset} closed at ${closePrice}`,
                reply: { messageReference: messageId }
            });
        } catch (error) {
            console.error('Error handling close_modal_:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: '❌ เกิดข้อผิดพลาดในระบบ', flags: MessageFlags.Ephemeral }).catch(console.error);
            }
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