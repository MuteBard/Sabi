const client = require("../discord/discordClient");
const { chatEvent, clearEvent } = require("./events");
const events = require("../util/eventNames");
const {
	commands,
	checkCommand,
	strictCheckCommand,
} = require("../util/commands");
const { discord } = require("../../settings");
const { gifs } = require("../service/imagelinks");

function createEmitterData(eventName, message, url, context, assistant) {
	return {
		client,
		message,
		eventName,
		url,
		context,
		assistant,
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
				commands.HEY_SABI.url,
				commands.HEY_SABI.context,
				commands.HEY_SABI.name
			);
			const botResponseParts = await chatEvent(emitterData);
			loadingMessage.delete();
			botResponseParts.map((part) => message.reply(part));
		}

		if (checkCommand(message, commands.HEY_SLOBBI.name)) {
			let loadingMessage = await message.channel.send(gifs.bouncebar);

			emitterData = createEmitterData(
				events.CHAT_GPT,
				message,
				commands.HEY_SLOBBI.url,
				commands.HEY_SLOBBI.context,
				commands.HEY_SLOBBI.name
			);

			const botResponseParts = await chatEvent(emitterData);
			loadingMessage.delete();
			botResponseParts.map((part) => message.reply(part));
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

	});


}

module.exports = runDiscord;
