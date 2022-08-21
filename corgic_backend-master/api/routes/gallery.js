const galleryControllers = require("../controllers/gallery");
const { Router } = require("express");
const router = Router();

const GalleryRoutes=(app)=>{
    router.get("/get-gallery-api/:limit",galleryControllers.getGallery)
    //router.get("/insert-Images",galleryControllers.insertImages)
    app.use("/gallery", router);
}

module.exports = GalleryRoutes;