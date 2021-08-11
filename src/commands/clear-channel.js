module.exports = {
    name: 'clear',
    description: 'Deletes a number of messages in a channel. If not specified, deletes all messages <= 2 weeks old.',
    permissions: [
        'MANAGE_MESSAGES'
    ],
    options: [
        {
            name: 'channel',
            description: 'The channel to delete messages in.',
            type: 'CHANNEL',
            required: true
        }, {
            name: 'msgcount',
            description: 'The count of messages to delete, between 0 and 100.',
            type: 'INTEGER'
        }
    ],
    global: true, 
    async run(interaction, guild, author, options) {
        const channel = options._hoistedOptions[0].channel

        let embed
        if(!channel.isText()) {
            embed = util.embedify('RED', author.user.username, author.user.displayAvatarURL(), `<#${channel.id}> is not a text channel.`)
        } else {
            msgCount = options._hoistedOptions[1]?.value ?? 100
            if (msgCount && msgCount > 100 || msgCount < 0) {
                embed = util.embedify('RED', author.user.username, author.user.displayAvatarURL(), `Invalid Length: \`${msgCount}\` out of bounds.`)
            } else {
                await channel.bulkDelete(msgCount)
                    .then((val) => {
                        embed = util.embedify('GREEN', author.user.username, author.user.displayAvatarURL(), `Deleted \`${val.size}\` messages.`) 
                    })
            }
        }

        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}