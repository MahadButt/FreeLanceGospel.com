const forumControllers = require("../controllers/forum");
const { isAuth } = require("../middlewares/auth");

const { Router } = require("express");

const router = Router();

const forumRoutes = (app) => {

    router.post("/new", isAuth, forumControllers.createPost);

    router.post("/reply", isAuth, forumControllers.postReply);

    router.get("/get-forum-home", forumControllers.prepareForumPage);

    router.get("/get-posts/:topic_id", forumControllers.getPostByTopicId);

    router.get("/get-forum-post/:post_id", forumControllers.getPostById);

    router.get("/section-post", forumControllers.getSectionPosts);

    router.get("/search-post", forumControllers.postSearch);

    router.delete("/del-post/:post_id",isAuth, forumControllers.deleteForumPost);

    router.patch("/update-post/:post_id", forumControllers.updateForumPost);

    app.use("/forum", router);
}

module.exports = forumRoutes;