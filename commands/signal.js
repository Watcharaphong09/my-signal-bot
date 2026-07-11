const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('signal')
        .setDescription('ส่งสัญญาณเทรดเข้าห้อง (เฉพาะแอดมิน)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('signal_modal')
            .setTitle('⚡ Create New Signal');

        // Create the text input components
        const assetInput = new TextInputBuilder()
            .setCustomId('assetInput')
            .setLabel('Asset & Direction (e.g., XAUUSD BUY)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const entryInput = new TextInputBuilder()
            .setCustomId('entryInput')
            .setLabel('Entry Price')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const slInput = new TextInputBuilder()
            .setCustomId('slInput')
            .setLabel('Stop Loss (SL)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const tpInput = new TextInputBuilder()
            .setCustomId('tpInput')
            .setLabel('Take Profit Targets (e.g. 2000, 2010)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const imageInput = new TextInputBuilder()
            .setCustomId('imageInput')
            .setLabel('Image URL (Optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        // An action row only holds one text input, so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(assetInput);
        const secondActionRow = new ActionRowBuilder().addComponents(entryInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(slInput);
        const fourthActionRow = new ActionRowBuilder().addComponents(tpInput);
        const fifthActionRow = new ActionRowBuilder().addComponents(imageInput);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    }
};