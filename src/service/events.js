const schedule = require("../util/cronManager");
const { createKey } = require("../redis/redisClient");
const { encodeToken } = require("../util/jwt");
const textSplit = require("../util/textSplit");
const { chatGPT } = require("../../settings");
const { get, post, buildHeaders } = require("../axios/axiosClient");

async function clearEvent(emitterData) {
	const { eventName, message, url } = emitterData;
	let botResponse = `Memory has not been cleared...`;

	const key = createKey(
		message.author.globalName,
		message.author.id,
		eventName
	);

	const jwtBody = {
		id: message.id,
		userId: message.author.id,
		userName: message.author.globalName,
		key,
		timeStamp: message.createdTimestamp,
	};

	const jwtToken = encodeToken(jwtBody, chatGPT.chat_secret);
	const headers = buildHeaders(jwtToken);
	const response = await get(url, headers);

	if (response.data) {
		botResponse = `Hey ${message.author.globalName}, my memory of our past conversations has been cleared.`;
	}

	return botResponse;
}

async function chatEvent(emitterData) {
	const { eventName, message, url, context, assistant } = emitterData;
	const text = message.content.split("\n").join(""); // the match may not work against the pattern as expected after this but i cant spend too much time on this, this however solves the inability to read code snippets
	const pattern = getPattern(assistant);

	const match = text.match(pattern);
	let question = null;

	if (match) {
		question = match[1];
	}

	if (!question) {
		const greetings = getGreetings(assistant, message.author.globalName);
		const size = greetings.length;
		const botResponse = greetings[Math.floor(Math.random() * size)];
		const updatedBotResponseParts = textSplit(botResponse);

		return updatedBotResponseParts;
	}

	const key = createKey(
		message.author.globalName,
		message.author.id,
		eventName
	);

	const jwtBody = {
		id: message.id,
		userId: message.author.id,
		userName: message.author.globalName,
		key,
		timeStamp: message.createdTimestamp,
	};

	const requestBody = {
		key,
		context: `${context}, the user's name is ${message.author.globalName}`,
		question,
	};

	const jwtToken = encodeToken(jwtBody, chatGPT.chat_secret);
	const headers = buildHeaders(jwtToken);
	const response = await post(url, requestBody, headers);
	const botResponse = response.data.response;
	const updatedBotResponseParts = textSplit(botResponse);

	return updatedBotResponseParts;
}

function getPattern(assistant) {
	let pattern = null; // 'i' for case-insensitive matching
	switch (assistant) {
		case "heysabi":
			pattern = /(?:hey\s*sabi[.,!?]?)[\s]*(.*)/i;
			break;
		case "heyslobbi":
			pattern = /(?:hey\s*slobbi[.,!?]?)[\s]*(.*)/i;
			break;
		default:
			throw new Error("Unknown assistant name provided.");
	}
	return pattern;
}

function getGreetings(assistant, userName) {
	let greetings = null;
	switch (assistant) {
		case `heysabi`:
			greetings = [
				`Hello, ${userName}! How can I assist you today with your programming questions?`,
				`Hi, ${userName}! How can I help you today with your programming questions?`,
				`Greetings, ${userName}! How can I assist you today with your programming questions?`,
				`Hey there, ${userName}! How can I assist you today with your programming questions?`,
				`Good to see you, ${userName}! How can I assist you today with your programming questions?`,
				`What's up, ${userName}? How can I help you with your programming questions?`,
				`Nice to meet you, ${userName}!`,
				`Pleased to meet you, ${userName}!`,
				`How are you doing, ${userName}?`,
				`How's it going, ${userName}?`,
			];
			break;
		case `heyslobbi`:
			greetings = [
				`Hello, ${userName}! What creative project are you currently working on?`,
				`Hi, ${userName}! How can I assist you with your artistic endeavors today?`,
				`Greetings, ${userName}! How can I inspire your creativity today?`,
				`Hey there, ${userName}! What art forms are you exploring today?`,
				`Good to see you, ${userName}! How can I support your creative journey today?`,
				`What's up, ${userName}? Any exciting art projects on your mind?`,
				`Nice to meet you, ${userName}! How do you express your creativity?`,
				`Pleased to meet you, ${userName}! Share with me your latest creative inspiration.`,
				`How are you doing, ${userName}? What artistic passions drive you?`,
				`How's it going, ${userName}? Any new art techniques you're eager to try?`,
			];
			break;
		default:
			throw new Error("Unknown assistant name provided.");
	}
	return greetings;
}

module.exports = {
	chatEvent,
	clearEvent,
};
