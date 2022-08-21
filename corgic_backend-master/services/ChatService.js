const logger = require("../loaders/logger");
const { transaction } = require("objection");

const ChatChannel = require("../models/ChatChannel");
const ChatLine = require("../models/ChatLine");

const chatService = {

    createChannel: async function(from, to) {
        
        try {

            const result = await transaction(ChatChannel.knex(), async (trx) => {

                const peerId = [`$ch-${from}-${to}`, `$ch-${to}-${from}`];

                let channel = await ChatChannel
                    .query(trx)
                    .findOne({ channel_name: peerId[0] })
                    .orWhere({ channel_name: peerId[1] });

                if (channel) {
                    return { exists: true, channel_id: channel.id, channel_name: channel.channel_name };
                }

                channel = await ChatChannel.query().insert({ 
                    channel_name: peerId[0] ,
                    u_1: from,
                    u_2: to
                });

                return { created: true, channel_id: channel.id, channel_name: channel.channel_name };
            });

            return result;
            
        } catch (err) {
            logger.error(err);
        }
    },

    insertMessage: async function(channel_id, from, msg) {

        try {
         
            await ChatLine.query().insert({
                channel_id,
                u_id: from,
                line_text: msg
            });

            return true;

        } catch (err) {
            logger.error(err);
        }
    },

    getMessages: async function(u_id) {

        try {

            let messages = await ChatChannel
                .query()
                .eager("[user_one, user_two]")
                .orWhere({ u_1: u_id })
                .orWhere({ u_2: u_id });            
            
            return messages;
            
        } catch (err) {
            logger.error(err);
        }
    },

    getMessageByChannel: async function(channel_name) {

        try {

            const messages = await ChatChannel
                .query()
                .eager("[messages, user_one, user_two]")
                .findOne({ channel_name });

            const sortedMessages = messages.messages.sort((a, b) => b.created_at - a.created_at);

            messages.messages = sortedMessages;

            return messages;
            
        } catch (err) {
            logger.error(err);
        }
    }
};

module.exports = chatService;