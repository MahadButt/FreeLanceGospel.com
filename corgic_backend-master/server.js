const express = require("express");
const loader = require("./loaders");
const socketio = require("socket.io");

const chatLoader = require("./loaders/chatSocket")

const startServer = async () => {

    const app = express();

    loader(app);

    const server = app.listen(process.env.PORT, err => {

        if (err) {
            process.exit(1);
            return;
        }

        console.log(`
            ####################################
            🛡️  Server listening on port: ${ process.env.PORT } 🛡️
            ####################################
        `);
    });

    const io = socketio(server, {

        handlePreflightRequest: (req, res) => {
            const headers = {
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
                "Access-Control-Allow-Credentials": true
            };
            
            res.writeHead(200, headers);
            res.end();
        }
    });

    chatLoader(io);

    io.listen(server);
}

startServer();
