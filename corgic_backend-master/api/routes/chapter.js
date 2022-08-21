const chapControllers = require("../controllers/chapter");
const { isAuth } = require("../middlewares/auth");

const { Router } = require("express");

const router = Router();

const chapRoutes = (app) => {

    router.post("/new", isAuth, chapControllers.createChapter);

    router.get("/get-chapters",isAuth, chapControllers.getChapters);

    router.patch("/update/:chap_id", chapControllers.updateChapter);

    app.use("/chapter", router);
}

module.exports = chapRoutes;