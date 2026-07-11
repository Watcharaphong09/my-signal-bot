const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('signal')
        .setDescription('ส่งสัญญาณเทรดเข้าห้อง (เฉพาะแอดมิน)')
        .addStringOption(option => option.setName('asset').setDescription('คู่เทรด (Asset)').setRequired(true)
            .addChoices(
                { name: 'XAUUSD', value: 'XAUUSD' },
                { name: 'BTCUSD', value: 'BTCUSD' },
                { name: 'US30', value: 'US30' },
                { name: 'NASDAQ', value: 'NASDAQ' },
                { name: 'EURUSD', value: 'EURUSD' },
                { name: 'GBPUSD', value: 'GBPUSD' }
            )
        )
        .addStringOption(option => option.setName('direction').setDescription('ทิศทางออเดอร์').setRequired(true)
            .addChoices(
                { name: '🟢 BUY', value: 'BUY' },
                { name: '🔴 SELL', value: 'SELL' }
            )
        )
        .addAttachmentOption(option => option.setName('image').setDescription('แนบรูปกราฟประกอบ (Optional)').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const asset = interaction.options.getString('asset');
        const direction = interaction.options.getString('direction');
        const image = interaction.options.getAttachment('image');

        // Initialize cache on client if it doesn't exist
        if (!interaction.client.imageCache) interaction.client.imageCache = new Map();
        
        // Cache image if provided
        if (image) {
            interaction.client.imageCache.set(interaction.user.id, image.url);
        } else {
            interaction.client.imageCache.delete(interaction.user.id);
        }

        // Create the modal - CustomId includes asset and direction
        const modal = new ModalBuilder()
            .setCustomId(`signal_modal_${asset}_${direction}`)
            .setTitle(`⚡ ${asset} ${direction} Signal`);

        const entryInput = new TextInputBuilder()
            .setCustomId('entryInput')
            .setLabel('Entry Price')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const slInput = new TextInputBuilder()
            .setCustomId('slInput')
            .setLabel('Stop Loss (SL) Price')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const tp1Input = new TextInputBuilder()
            .setCustomId('tp1Input')
            .setLabel('TP1 Price')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const tp2Input = new TextInputBuilder()
            .setCustomId('tp2Input')
            .setLabel('TP2 Price (Optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const fullTpInput = new TextInputBuilder()
            .setCustomId('fullTpInput')
            .setLabel('Full TP Price (Required)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(entryInput),
            new ActionRowBuilder().addComponents(slInput),
            new ActionRowBuilder().addComponents(tp1Input),
            new ActionRowBuilder().addComponents(tp2Input),
            new ActionRowBuilder().addComponents(fullTpInput)
        );

        await interaction.showModal(modal);
    }
};