const adminControllers = require("../controllers/admin");
const { isAdmin } = require("../middlewares/auth");
const { Router } = require("express");
const uploadService = require("../../services/UploadService");

const router = Router();

const adminRoutes = (app) => {

    router.post("/sign-in", adminControllers.postSignIn);

    router.post("/new", isAdmin, adminControllers.createAdmin);

    router.get("/contact", isAdmin, adminControllers.getContacts);

    router.patch("/contact-status/:id", isAdmin, adminControllers.patchContact);

    router.get("/stats", isAdmin, adminControllers.generateStats);

    router.get("/users", isAdmin, adminControllers.getUsers);

    router.patch("/user-status/:id", isAdmin, adminControllers.patchUserStatus);

    router.get("/status", isAdmin, adminControllers.getSiteStatus);

    router.post("/status", isAdmin, adminControllers.insertSiteStatus);

    router.post("/member-week", isAdmin, adminControllers.newMemberOfTheWeek);

    router.post("/library", isAdmin, adminControllers.postLibrary);

    router.patch("/remove-member-week", isAdmin, adminControllers.removeMemberWeek);

    router.get("/signed-url", isAdmin, adminControllers.getPreSignedUrl);

    router.get("/library", isAdmin, adminControllers.getLibrary);

    router.get("/get-lib/:lib_id",isAdmin, adminControllers.getLibById);

    router.delete("/del-library/:id", isAdmin, adminControllers.deleteLibrary);

    router.post("/update-library/:lib_id", isAdmin, adminControllers.updateLibrary)

    router.post("/new-quiz-category", isAdmin, adminControllers.createCategory);

    router.get("/get-quiz-categories",isAdmin, adminControllers.getCategories);

    router.patch("/update-quiz-catetory/:cat_id",isAdmin, adminControllers.updateCategory);

    router.delete("/del-quiz-category/:cat_id",isAdmin, adminControllers.deleteCategory);

    router.post("/new-quiz-question", isAdmin, adminControllers.createQuizQuestion);

    router.get("/get-quiz-questions",isAdmin, adminControllers.getQuizQuestions);

    router.patch("/update-quiz-question/:question_id",isAdmin, adminControllers.updateQuizQuestion);

    router.delete("/del-quiz-question/:question_id",isAdmin, adminControllers.deleteQuizQuestion);

    router.get("/search-question/:cat_id",isAdmin, adminControllers.searchQuestion);

    router.post("/new-gallery-images", isAdmin,uploadService.uploadImageToDisk.array("disk"), adminControllers.createGalleryImages);

    router.get("/get-images", isAdmin, adminControllers.getImages);

    router.delete("/del-image/:image_id", isAdmin, adminControllers.deleteImage);

    router.post("/new-blog-category", isAdmin, adminControllers.createBlogCategory);

    router.get("/get-blog-categories",isAdmin, adminControllers.getBlogCategories);

    router.patch("/update-blog-catetory/:cat_id",isAdmin, adminControllers.updateBlogCategory);
    
    router.post("/new-blog-subcategory", isAdmin, adminControllers.createBlogSubCategory);

    router.get("/get-blog-subcategory",isAdmin, adminControllers.getBlogSubCategories);

    router.patch("/update-blog-subcategory/:cat_id",isAdmin, adminControllers.updateBlogSubCategory);

    router.post("/videos", isAdmin, adminControllers.postVideo);

    router.get("/videos", isAdmin, adminControllers.getVideos);

    router.delete("/del-video/:id", isAdmin, adminControllers.deleteVideo);
    
    router.delete("/del-lib_document/:id", isAdmin, adminControllers.deleteLibraryDocuments);
    app.use("/admin", router);
}

module.exports = adminRoutes;