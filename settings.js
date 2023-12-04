"use strict";

const ENV = process.env;

exports.discord = {
    application_id:  ENV["DISCORD_APPLICATION_ID"],
    public_key: ENV["DISCORD_PUBLIC_KEY"],
    client_id: ENV["DISCORD_CLIENT_ID"],
    client_secret: ENV["DISCORD_CLIENT_SECRET"],
    server_id: ENV["DISCORD_SERVER_ID"],
    channel_id: ENV["DISCORD_CHANNEL_ID"],
    token: ENV["DISCORD_TOKEN"],
    display_message: ENV["DISCORD_DISPLAY_MESSAGE"]
};

exports.redis = {
    password: ENV["REDIS_PASSWORD"],
    token: ENV["REDIS_TOKEN"],
    port: ENV["REDIS_PORT"] && Number(ENV["REDIS_PORT"]) ,
    endpoint: ENV["REDIS_ENDPOINT"],
    region: ENV['REDIS_REGION']
}

exports.chatGPT = {
    url: ENV["CHAT_URL"],
    chat_secret: ENV["CHAT_SECRET"],
    chat_expiration: ENV["CHAT_EXPIRATION"],
    chat_url: ENV["CHAT_URL"],
    chat_context:ENV["CHAT_CONTEXT"]
}
