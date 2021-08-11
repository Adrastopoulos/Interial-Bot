module.exports = {
    name: 'reset', 
    description: 'Reset all slash commands.',
    options: null,
    ownerOnly: true, 
    async run(interaction, guild, author, options) {
        guild.commands.set([])
        embed = util.embedify(
            'GREEN', 
            author.user.username, 
            author.user.displayAvatarURL(), 
            `Reset slash commands for **${guild.name}**.`
        )
        
        await interaction.reply({ embeds: [ embed ], ephemeral: true })
    }
}