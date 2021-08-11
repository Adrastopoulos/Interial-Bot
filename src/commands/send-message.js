const Discord = require("discord.js")

module.exports = {
    name: 'send', 
    description: 'Send a message in a specified channel.',
    permissions: [
        'ADMINISTRATOR'
    ],
    options: [
        {
            name: 'embed',
            description: 'Send a message embed.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to send the message to.',
                    type: 'CHANNEL',
                    required: true
                }, {
                    name: 'description',
                    description: 'The embed description.',
                    type: 'STRING',
                    required: true
                }, {
                    name: 'color',
                    description: 'The embed color.',
                    type: 'STRING',
                    required: false
                }, {
                    name: 'title',
                    description: 'The embed title.',
                    type: 'STRING',
                    required: false
                }, {
                    name: 'icon_url',
                    description: 'The embed icon.',
                    type: 'USER',
                    required: false
                }, {
                    name: 'footer',
                    description: 'The embed footer.',
                    type: 'STRING',
                    required: false
                }
            ]
        },
        {
            name: 'text',
            description: 'Send a text message.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to send the message to.',
                    type: 'CHANNEL',
                    required: true
                }, {
                    name: 'content',
                    description: 'The message content.',
                    type: 'STRING',
                    required: true
                }
            ]
        },
    ],
    async run(interaction, guild, author, options) {
        const channel = options._hoistedOptions[0].channel

        if(!channel.isText()) {
            await interaction.reply({ content: `<#${channel.id}> is not a text channel.`, ephemeral: true })
            return
        }

        const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('confirm')
                        .setLabel('Confirm')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
                        .setStyle('DANGER')
                )

        let embed, content
        if(options._subcommand === 'embed') {
            const color = options._hoistedOptions[2]?.value
            const title = options._hoistedOptions[3]?.value
            const icon_url = options._hoistedOptions[4]?.member.user.displayAvatarURL()
            const description = options._hoistedOptions[1]?.value
            description = format(description)
            const footer = options._hoistedOptions[5]?.value
            embed = util.embedify(
                color, title, icon_url, description, footer
            )

            await interaction.reply({ content: '**Message Preview**\n', embeds: [embed], components: [row] })
        } else {
            content = options._hoistedOptions[1].value
            content = format(content)
            await interaction.reply({ content: `**Message Preview**\n${content}`, components: [row] })
        }


        const reply = await interaction.fetchReply()

        reply.awaitMessageComponent().then(async interaction => {
            if(interaction.customId === 'confirm') {
                channel.send({ content: content ?? null, embeds: embed ? [embed] : [] }).then(async (msg) => {
                    await interaction.reply({ content: `Message sent [here](${msg.url}).`, ephemeral: true })
                })
            } else {
                await interaction.reply({ content: 'Canceled message.', ephemeral: true })
            }

            await reply.delete()
        })
    }
}

const format = (string) => {
    return string.split('\\n').join('\n')
}