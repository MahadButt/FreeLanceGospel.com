
const chatControllers = require("../controllers/chat");
const { isAuth } = require("../middlewares/auth");
const { Router } = require("express");

const router = Router();

const chatRoutes = (app) => {

    router.get("/channel",  isAuth, chatControllers.getChannel);

    router.get("/messages", isAuth, chatControllers.getMessages);

    router.get("/message/:channel_name", isAuth, chatControllers.getMessageByChannel);

    app.use("/chat", router);
}

module.exports = chatRoutes;