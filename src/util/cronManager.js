const events = require("./eventNames");
const { redis } = require("../redis/redisClient");

function schedule(emitterData) {
	const { client, message, eventName } = emitterData;
	client.emit(events.NOTICE, { message, text: "Starting scheduler..." });

	const task = async () => {
		const text = await redis.get(eventName);
		client.emit(eventName, { message, text });
	};

	cron.schedule(`* * * * *`, task);
	return cron;
}

module.exports = {
	schedule,
};
