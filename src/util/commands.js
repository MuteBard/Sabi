const { chatGPT } = require("../../settings");

const commands = {
    HEY_SABI: {
        name: 'heysabi',
        url: `${chatGPT.chat_url}/ai/chat`
    },
    CLEAR_SABI:{
        name: '!clear',
        url: `${chatGPT.chat_url}/ai/clear`
    }
}

function checkCommand(message, command) {
    const cleanedMessage = message.content.toLowerCase().trim().split("").filter(_ => _ !== " ").join("");
    return cleanedMessage.startsWith(command);
}

function strictCheckCommand(message, command) {
    return message.content.toLowerCase().trim() === command;
}

module.exports = {
    commands,
    checkCommand,
    strictCheckCommand
}