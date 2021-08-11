module.exports = {
    name: 'ping',
    description: 'ping',
    options: null,
    global: true, 
    async run(interaction) {
        await interaction.reply(`Pong! \`${client.ws.ping}ms\``)
    }
}