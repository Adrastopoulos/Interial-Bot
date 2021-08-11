require('dotenv').config()

const Discord = require('discord.js')
const fs = require('fs')
const util = require('./util/util')

const client = new Discord.Client({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES', 
        'GUILD_BANS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'DIRECT_MESSAGES',
    ]
})

client.commands = new Discord.Collection()

global.client = client
global.Discord = Discord
global.util = util

client.on('ready', async () => {
    console.log(`${client.user.tag} Ready`)

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
    for(const commandFile of commandFiles) {
        const command = require(`./commands/${commandFile}`)
        await client.guilds.cache.get(process.env.GUILD_ID).commands.create(command)
        client.commands.set(command.name, command)
        console.log(`${command.name} command registered`)
    }
})

client.on('interactionCreate', async interaction => {
    if(interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName)
        const author = interaction.member
        const guild = author.guild
        const options = interaction.options
        command?.run(interaction, guild, author, options).catch(err => {
            const embed = util.embedify(
                'RED',
                author.user.username, 
                author.user.displayAvatarURL(),
                `**Command**: \`${command.name}\`\n\`\`\`js\n${err}\`\`\`
                You've encountered an error.
                Report this to Adrastopoulos#2753 in [Interial](https://discord.gg/fR7M6pPAUg)`
            )

            if(interaction.replied) {
                interaction.followUp({ embeds: [ embed ], ephemeral: true })
            } else {
                interaction.reply({ embeds: [ embed ], ephemeral: true })
            }
        })
    }
})

client.login(process.env.TOKEN)