const userControllers = require("../controllers/user");
const UploadService = require("../../services/UploadService");
const { isAuth, isAllowed, isOwnProfile } = require("../middlewares/auth");

const { Router } = require("express");

const router = Router();

const userRoutes = (app) => {

    router.get("/countries", userControllers.getCountries);

    router.get("/cities", userControllers.getCities);

    router.get("/get-user/:u_id", isAuth, isOwnProfile, userControllers.getUserById);

    router.get("/get-images/:u_id", isAuth, userControllers.getImagesByID);

    router.patch("/patch-basic/:u_id", isAuth, isAllowed, userControllers.patchUserBasic);

    router.patch("/change-pp/:u_id", 
        isAuth, isAllowed, 
        UploadService.uploadImageToDisk.array("disk"), 
        userControllers.patchProfilePic
    );
    router.post("/add-headerImg/:u_id", 
        isAuth, isAllowed, 
        UploadService.uploadImageToDisk.array("disk"), 
        userControllers.addHeaderImages
    );

    router.post("/send-friend-req", isAuth, userControllers.sendFriendReq);

    router.patch("/respond-friend-req", isAuth, userControllers.respondFriendReq);

    router.get("/check-friend/:u_id", isAuth, userControllers.checkIfFriend);

    router.get("/friends", isAuth, userControllers.getFriends);

    router.get("/search-friends", isAuth, userControllers.searchFriends);

    router.post("/contact", userControllers.postContactUs);

    router.get("/user-search", isAuth, userControllers.userSearch);

    router.get("/notifications", isAuth, userControllers.getNotifications);

    router.patch("/mark-notification/:id", isAuth, userControllers.markNotification);

    router.get("/member-week", userControllers.getMemberOfWeek);

    router.get("/member-month", userControllers.getMemberOfMonth);

    router.get("/library", isAuth, userControllers.getLibrary);

    router.get("/get-all-images", isAuth, userControllers.getAllImagesByID);
    //Favourites Books
    router.get("/get-all-books/:u_id", isAuth, userControllers.getAllBooksByID);
    router.post("/add-book", isAuth, userControllers.postBook);
    router.post("/update-book/:id", isAuth, userControllers.updateBook);
    router.delete("/delete-book/:id", isAuth, userControllers.deleteBook);
    //Favourites Movies
    router.get("/get-all-movies/:u_id", isAuth, userControllers.getAllMoviesByID);
    router.post("/add-movie", isAuth, userControllers.postMovie);
    router.post("/update-movie/:id", isAuth, userControllers.updateMovie);
    router.delete("/delete-movie/:id", isAuth, userControllers.deleteMovie);
    //Favourites Books
    router.get("/get-all-musics/:u_id", userControllers.getAllMusicsByID);
    router.post("/add-music",
        isAuth,
        UploadService.uploadAudioToDisk.single("disk"),
        userControllers.postMusic
    );
    router.post("/update-music/:id", isAuth, UploadService.uploadAudioToDisk.single("disk"), userControllers.updateMusic);
    router.delete("/delete-music/:id", isAuth, userControllers.deleteMusic);
    router.put("/default-music/:id", isAuth, userControllers.updateDefaultMusic);
      
      // endpoint to fetch a single video's metadata
    router.get('/music/:id/data', userControllers.getMusicByID)
      
    router.get('/music/:path', userControllers.startMusicStream)

    router.post("/update-msg_read/:id", isAuth, userControllers.updateMsgRead);

    router.get("/check_member/:u_id", isAuth, userControllers.checkMemberWeekMonth);

    router.get("/get-all-videos", userControllers.getAllVideos);

    router.get('/video/:id', userControllers.getVideoByID)

    app.use("/user", router);
}

module.exports = userRoutes;