
const chatService = require("../services/ChatService");

const chatLoader = (io) => {

    io.on("connection", function(socket) {

        socket.on("get_channel", async function(data) {

            const { to, from } = data;

            const channel = await chatService.createChannel(from, to);

            socket.emit("channel_name", { channel_name: channel.channel_name });
        });

        socket.on("private_chat", async function(data) {
            
            const { to, from, msg } = data;

            const channel = await chatService.createChannel(from, to);

            if (channel.exists || channel.created) {

                const message = await chatService.insertMessage(channel.channel_id, from, msg);

                if (message) {
        
                    io.emit(channel.channel_name, {
                        from: from,
                        msg: msg
                    });
                }
            }

        });

        socket.on("disconnect", () => {
            console.log("socket disconnected");
        });
    });
}

module.exports = chatLoader;