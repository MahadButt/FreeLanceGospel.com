
const { Router } = require("express");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const blogRoutes = require("./routes/blog");
const chapRoutes = require("./routes/chapter")
const forumRoutes = require("./routes/forum");
const adminRoutes = require("./routes/admin");
const quizRoutes = require("./routes/quiz");
const libRoutes = require("./routes/library");
const galleryRoutes = require("./routes/gallery");
const adminForumRoutes = require("./routes/admin/forum")

const loadRoutes = () => {

    const router = Router();

    authRoutes(router);
    userRoutes(router);
    chatRoutes(router);
    blogRoutes(router);
    chapRoutes(router);
    forumRoutes(router);
    adminRoutes(router);
    quizRoutes(router);
    libRoutes(router);
    galleryRoutes(router);
    adminForumRoutes(router);

    return router;
}

module.exports = loadRoutes;
