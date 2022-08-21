const libControllers = require("../controllers/library");
const { Router } = require("express");
const router = Router();

const LibraryRoutes=(app)=>{
    router.get("/get-library-api",libControllers.getLibraryApi)
    router.get("/get-library-detail",libControllers.getLibraryDetail)
    router.get("/library-list",libControllers.libraryList)
    router.get("/get-library/:lib_id",libControllers.getLibrary)
    router.get("/downloadImage",libControllers.downloadImage)
    app.use("/lib", router);
}

module.exports = LibraryRoutes;