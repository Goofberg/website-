require('dotenv').config();
const { Client, IntentsBitField, SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
    partials: [
        "MESSAGE",
        "CHANNEL",
        "REACTION"
    ]
});


client.on('messageCreate', async (message) => {
    if (message.content.includes('THY END IS NOW!')) {
        const parts = message.content.split(' ');

        // Extract the message, member ID, duration, and unit
        const messagePart = parts[0];
        const memberId = message.mentions.members.first()?.id || '';
        const durationPartIndex = parts.indexOf('FOR');
        const durationPart = durationPartIndex !== -1 ? parts[durationPartIndex + 1] : '';
        const unitPart = durationPartIndex !== -1 ? parts[durationPartIndex + 2] : '';

        // Find the member object using the member ID
        const member = message.guild.members.cache.get(memberId);
        
        let timeoutDuration = 0;
        switch (unitPart.toUpperCase()) {
            case 'SEC':
            case 'SECS':
            case 'SECOND':
            case 'SECONDS':
                timeoutDuration = durationPart * 1000;
                break;
            case 'MIN':
            case 'MINS':
            case 'MINUTE':
            case 'MINUTES':
                timeoutDuration = durationPart * 1000 * 60;
                break;
            case 'HOUR':
            case 'HOURS':
                timeoutDuration = durationPart * 1000 * 60 * 60;
                break;
            case 'DAY':
            case 'DAYS':
                timeoutDuration = durationPart * 1000 * 60 * 60 * 24;
                break;
            default:
                break;
        }
        
        if (member === null || member === undefined) {
            message.reply("The Person you have given me is a False Person or a Role that i can't Timeout!")
            return;
        }
        try {
            if (timeoutDuration > 0) {
                member.timeout(timeoutDuration);
                message.reply(`GET FU**** @${member.displayName}`)
            } else {
                message.reply("Bro The Duration can't be below 0!")
            }
          } catch (error) {
            console.log(error)
          }
    }
});

client.on('ready', async () => {
    console.log("The bot is online!");
});

client.login(process.env.TOKEN);