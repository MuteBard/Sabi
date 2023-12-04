const schedule = require("../util/cronManager");
const { createKey } = require("../redis/redisClient");
const { encodeToken } = require("../util/jwt");
const { chatGPT } = require("../../settings");
const { get, post, buildHeaders } = require("../axios/axiosClient");

// TODO: implement later
async function alexaEvent(emitterData) {
	// schedule(emitterData, callback);
}
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
		botResponse = `Hey ${message.author.globalName}, my memory of our past conversations has been cleared.`
	}
	
	return botResponse;
}

async function chatEvent(emitterData) {
	const { eventName, message, url } = emitterData;
	let botResponse = null;
	const text = message.content;
	const pattern = /(?:hey\s*sabi[.,!?]?)[\s]*(.*)/i; // 'i' for case-insensitive matching

	const match = text.match(pattern);
	let question = null;

	if (match) {
		question = match[1];
	}

	if (!question) {
		const greetings = [
			`Hello, ${message.author.globalName}! How can I assist you today with your programming questions?`,
			`Hi, ${message.author.globalName}! How can I help you today with your programming questions?`, 
			`Greetings, ${message.author.globalName}! How can I assist you today with your programming questions?`,
			`Hey there, ${message.author.globalName}! How can I assist you today with your programming questions?`,
			`Good to see you, ${message.author.globalName}! How can I assist you today with your programming questions?`,
			`What's up, ${message.author.globalName}? How can I help you with your programming questions?`,
			`Nice to meet you, ${message.author.globalName}!`,
			`Pleased to meet you, ${message.author.globalName}!`,
			`How are you doing, ${message.author.globalName}?`,
			`How's it going, ${message.author.globalName}?`
		];

		const size = greetings.length;
		botResponse = greetings[Math.floor(Math.random() * (size))];
		
		return botResponse;
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
		context: `${chatGPT.chat_context}, the user's name is ${message.author.globalName}`,
		question,
	};

	const jwtToken = encodeToken(jwtBody, chatGPT.chat_secret);
	const headers = buildHeaders(jwtToken);
	const response = await post(url, requestBody, headers);
	botResponse = response.data.response;

	return botResponse;
}

module.exports = {
	alexaEvent,
	chatEvent,
	clearEvent
};
