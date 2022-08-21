const adminForumControllers = require("../../controllers/admin/forum");
const { isAdmin } = require("../../middlewares/auth");
const { Router } = require("express");

const router = Router();

const adminForumRoutes = (app) => {

    router.get("/get-forum-posts",isAdmin, adminForumControllers.getForumPosts);

    router.patch("/update-forum-post/:post_id",isAdmin, adminForumControllers.updateForumPost);
    
    router.post("/new-forum-topic", isAdmin, adminForumControllers.createForumTopic);

    router.get("/get-forum-topics",isAdmin, adminForumControllers.getForumTopics);

    router.patch("/update-forum-topic/:topic_id",isAdmin, adminForumControllers.updateForumTopic);

    router.post("/new-forum-section", isAdmin, adminForumControllers.createForumSection);

    router.get("/get-forum-sections",isAdmin, adminForumControllers.getForumSections);

    router.patch("/update-forum-section/:section_id",isAdmin, adminForumControllers.updateForumSection);

    app.use("/admin", router);
}

module.exports = adminForumRoutes;