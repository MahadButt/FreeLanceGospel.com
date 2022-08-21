const blogControllers = require("../controllers/blog");
const { isAuth } = require("../middlewares/auth");
const UploadService = require("../../services/UploadService");

const { Router } = require("express");

const router = Router();

const blogRoutes = (app) => {

    router.post("/new", isAuth, UploadService.uploadImageToDisk.single("disk"), blogControllers.createBlog);

    router.get("/categories", blogControllers.getBlogCategories);

    router.get("/sub-categories/:parent_id", blogControllers.getBlogSubCat);

    router.get("/tags", blogControllers.tagSearch);

    router.get("/get-blogs/:limit", blogControllers.getBlogs);

    router.delete("/del-blog/:blog_id",isAuth, blogControllers.deleteBlog);

    router.get("/get-blog/:blog_id", blogControllers.getBlogById);

    router.get("/search-blog", blogControllers.blogSearch);

    router.post("/comment", isAuth, blogControllers.postComment);

    router.patch("/update/:blog_id",isAuth, blogControllers.updateBlog);

    app.use("/blog", router);
}

module.exports = blogRoutes;