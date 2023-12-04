const { Redis } = require('@upstash/redis');
const settings = require('../../settings')

const redis = new Redis({
  url: `https://${settings.redis.endpoint}`,
  token: settings.redis.token,
})


function createKey(userName, id, eventName) {
  return `${userName}-${id}-${eventName}`
}
   
module.exports = {
  redis,
  createKey
};