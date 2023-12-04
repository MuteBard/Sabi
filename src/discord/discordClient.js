const { Client, IntentsBitField } = require('discord.js');
const { discord } = require('../../settings');

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,

]});

client.login(discord.token);

module.exports = client;
