const jwt = require('jsonwebtoken');
const { chatGPT } = require('../../settings')

function encodeToken(body, secret){
    const expiresIn = `${chatGPT.chat_expiration}m`
    const token = jwt.sign(body, secret, { expiresIn: expiresIn });
    return token;
}

function decodeToken(token){
    const data = decode(token);
    return data;
}

module.exports = {
    encodeToken,
    decodeToken
}