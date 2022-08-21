const chatService = require("../../services/ChatService");

const getChannel = async (req, res, async) => {

    const channel = await chatService.createChannel(parseInt(req.query.from), parseInt(req.query.to));
    return res.json(channel);
}

const getMessages = async (req, res, next) => {

    const messages = await chatService.getMessages(req.decode.u_id);
    return res.json(messages);
}

const getMessageByChannel = async (req, res, next) => {

    const messages = await chatService.getMessageByChannel(req.params.channel_name);
    return res.json(messages);
}

module.exports = {
    getChannel,
    getMessages,
    getMessageByChannel
}