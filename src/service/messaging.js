const client = require("../discord/discordClient");
const { redis } = require("../redis/redisClient");
const { alexaEvent, chatEvent, clearEvent } = require("./events");
const events = require("../util/eventNames");
const { commands, checkCommand, strictCheckCommand} = require("../util/commands");
const { discord } = require('../../settings')
const { gifs } = require("../service/imagelinks");

function createEmitterData(eventName, message, url) {
	return {
		client,
		message,
		eventName,
		url,
	};
}

function runDiscord() {
	client.once("ready", () => {
		client.user.setActivity(discord.display_message);
	});

	client.on("messageCreate", async (message) => {
		let emitterData = null;

		// Ignore messages from the bot itself
		if (message.author.bot) return;

		// Check for a specific command and respond
		if (checkCommand(message, commands.HEY_SABI.name)) {
			let loadingMessage = await message.channel.send(gifs.bouncebar);

			emitterData = createEmitterData(
				events.CHAT_GPT,
				message,
				commands.HEY_SABI.url
			);
			const botResponseParts = await chatEvent(emitterData);
			loadingMessage.delete();
			botResponseParts.map((part) => message.reply(part))
		}

		if (strictCheckCommand(message, commands.CLEAR_SABI.name)) {
			let loadingMessage = await message.channel.send(gifs.bouncebar);

			emitterData = createEmitterData(
				events.CHAT_GPT,
				message,
				commands.CLEAR_SABI.url
			);

			const botResponse = await clearEvent(emitterData);
			loadingMessage.delete();
			message.reply(botResponse);
		}

		// if (message.content.toLowerCase() === "!alexa_G") {
		// 	emitterData = createEmitterData(events.ALEXA_GENERAL, message);
		// 	// alexaEvent(emitterData);
		// }

		// if (message.content.toLowerCase() === "!set") {
		// 	message.reply("redis set abc");
		// }

		// if (message.content.toLowerCase() === "!get") {
		// 	const data = await redis.get("abc");
		// 	message.reply(`redis get ${events.ALEXA_GENERAL} ${data}`);
		// }
	});

	// client.on(events.NOTICE, async ({ message, text }) => {
	// 	await redis.set(events.NOTICE, null);
	// 	message.reply(text);
	// });

	// client.on(events.ALEXA_EMERGENCY, async ({ message, text }) => {
	// 	await redis.set(events.ALEXA_EMERGENCY, null);
	// 	message.reply(text);
	// });

	// client.on(events.ALEXA_GENERAL, async ({ message, text }) => {
	// 	await redis.set(events.ALEXA_GENERAL, null);
	// 	message.reply(text);
	// });


}

module.exports = runDiscord;
