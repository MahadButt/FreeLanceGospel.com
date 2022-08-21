const userService = require("../../services/UserService");
const friendService = require("../../services/FriendService");
const notificationService = require("../../services/NotificationService");
const nodemailer = require("nodemailer");
const fs = require("fs");
var dotenv = require("dotenv")
dotenv.config()
const transporter = nodemailer.createTransport({
    // host: "smtp.mail.yahoo.com",
    // port: 465,
    service: 'gmail',
    // secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});
const Email_FROM = `"GOSPEL" <${process.env.EMAIL}>`;
const getCountries = async (req, res, next) => {

    const countries = await userService.getCountries();
    return res.json(countries);
}
const getCities = async (req, res, next) => {

    const cities = await userService.getCities();
    return res.json(cities);
}

const getUserById = async (req, res, next) => {

    const user = await userService.getUserById(req.params.u_id, req.isOwnProfile);
    const headerImage = await userService.getHeaderImageById(req.params.u_id)
    if (user) {
        if (headerImage) {
            user.header_image_url = headerImage.image_url;
        } else {
            user.header_image_url = 'uploads/SupremHeader.jpg';
        }
    }
    const userDefaultMusic = await userService.getDefaultMusic(req.params.u_id);
    return res.json({
        user: user ? user : null,
        userDefaultMusic: userDefaultMusic.music ? userDefaultMusic.music[0] : null,
        isOwnProfile: req.isOwnProfile
    });
}
const getImagesByID = async (req, res, next) => {
    let images = []
    if (req.query.profile) {
        images = await userService.getProfileImagesForSliderById(req.params.u_id)
    } else if (req.query.header) {
        images = await userService.getHeaderImagesForSliderById(req.params.u_id)
    }
    if (images.length > 0) {
        return res.json({
            success: true,
            successResponse: images
        });
    } else {
        return res.json({
            success: false,
            msg: "Images not found"
        });
    }
}
const getAllImagesByID = async (req, res, next) => {
    let data = [];
    if (req.query.u_id) {
        data = await userService.getAllImagesById(req.query.u_id, req.query);
    } else {
        data = await userService.getAllImagesById(req.decode.u_id, req.query);
    }
    if (data.images.length > 0) {
        return res.json({
            success: true,
            successResponse: data
        });
    } else {
        return res.json({
            success: false,
            msg: "Images not found"
        });
    }
}

const patchUserBasic = async (req, res, next) => {

    const result = await userService.patchUserBasic(req.params.u_id, req.body);
    return res.json(result);
}

const patchProfilePic = async (req, res, next) => {
    //file for single image & files for array of iamges
    const result = await userService.patchProfilePic(req.params.u_id, req.files);
    return res.json(result);
}
const addHeaderImages = async (req, res, next) => {
    //file for single image & files for array of iamges
    const result = await userService.addHeaderImages(req.params.u_id, req.files);
    return res.json(result);
}

const sendFriendReq = async (req, res, next) => {

    const result = await friendService.sendFriendReq(req.body, req.decode);
    return res.json(result);
}

const respondFriendReq = async (req, res, next) => {

    const result = await friendService.respondFriendReq(req.body, req.decode);
    return res.json(result);
}

const checkIfFriend = async (req, res, next) => {

    const result = await friendService.checkIfFriend(req.decode.u_id, req.params.u_id);
    return res.json(result);
}

const postContactUs = async (req, res, next) => {

    const result = await userService.postContactUs(req.body);
    if (result.success) {
        transporter.sendMail({
            from: Email_FROM,
            to: Email_FROM,
            subject: 'Contact Us',
            html: `<html>
            <head>
            <title>Contact Us</title>
            </head>
            <body>
            <h2>${req.body.name}</h2>
            <h3>${req.body.email}</h2>
            <p>${req.body.message}</p>
            </body>
            </html>`
        }, function (err, _info) {
            if (err) {
                console.log(err)
            } else {
                console.log('email send successfully')
            }
        });
        return res.json(result);
    } else {
        return { success: false, msg: "Interval Server Error" };
    }
}

const userSearch = async (req, res, next) => {

    const users = await userService.userSearch(req.query, req.decode.u_id);
    return res.json(users);
}

const getNotifications = async (req, res, next) => {

    const notifications = await notificationService.getNotifications(req.decode.u_id);
    return res.json(notifications);
}

const markNotification = async (req, res, next) => {

    const result = await notificationService.markNotification(req.params.id, req.body.status);
    return res.json(result);
}

const getFriends = async (req, res, next) => {
    let friends;
    if (req.query.u_id) {
        friends = await friendService.getFriends(req.query.u_id, req.query.status, req.query.search_key);
    } else {
        friends = await friendService.getFriends(req.decode.u_id, req.query.status, req.query.search_key);
    }
    return res.json(friends);
}

const searchFriends = async (req, res, next) => {

    const friends = await friendService.searchFriends(req.decode.u_id, req.query.status, req.query.search_key);
    return res.json(friends);
}

const getMemberOfWeek = async (req, res, next) => {

    const member = await userService.getMemberOfWeek();
    return res.json(member);
}

const getMemberOfMonth = async (req, res, next) => {

    const member = await userService.getMemberOfMonth();
    return res.json(member);
}

const getLibrary = async (req, res, next) => {

    const library = await userService.getLibrary(req.query);
    return res.json(library);
}
//Favourites Books
const getAllBooksByID = async (req, res, next) => {
    let data = [];
    data = await userService.getAllBooksByID(req.params.u_id, req.query);
    if (data.books.length > 0) {
        return res.json({
            success: true,
            successResponse: data,
            count: data.count
        });
    } else {
        return res.json({
            success: false,
            msg: "Books not found"
        });
    }
}
const postBook = async (req, res, next) => {

    const body = JSON.parse(JSON.stringify(req.body));

    const result = await userService.createBook(req.decode.u_id, body);
    return res.json(result);
}
const updateBook = async (req, res, next) => {

    const result = await userService.updateBook(req.params.id, req.body);
    return res.json(result);
}
const deleteBook = async (req, res, next) => {

    const result = await userService.deleteBook(req.decode.u_id, req.params.id);
    return res.json(result);
}
//Favourites Movies
const getAllMoviesByID = async (req, res, next) => {
    let data = [];
    data = await userService.getAllMoviesByID(req.params.u_id, req.query);
    if (data.movies.length > 0) {
        return res.json({
            success: true,
            successResponse: data,
            count: data.count
        });
    } else {
        return res.json({
            success: false,
            msg: "Movies not found"
        });
    }
}
const postMovie = async (req, res, next) => {

    const body = JSON.parse(JSON.stringify(req.body));

    const result = await userService.createMovie(req.decode.u_id, body);
    return res.json(result);
}
const updateMovie = async (req, res, next) => {

    const result = await userService.updateMovie(req.params.id, req.body);
    return res.json(result);
}
const deleteMovie = async (req, res, next) => {

    const result = await userService.deleteMovie(req.decode.u_id, req.params.id);
    return res.json(result);
}
//Favourites Musics
const getAllMusicsByID = async (req, res, next) => {
    let data = [];
    data = await userService.getAllMusicsByID(req.params.u_id, req.query);
    if (data.musics.length > 0) {
        return res.json({
            success: true,
            successResponse: data.musics,
            count: data.count
        });
    } else {
        return res.json({
            success: false,
            msg: "Musics not found"
        });
    }
}
const getMusicByID = async (req, res, next) => {
    let data = await userService.getMusicByID(req.params.id);
    if (data.musics.length > 0) {
        return res.json({
            success: true,
            successResponse: data.musics[0]
        });
    } else {
        return res.json({
            success: false,
            msg: "Musics not found"
        });
    }
}
const startMusicStream = async (req, res, next) => {
    const path = `public/uploads/audio/${req.params.path}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        console.log('we have range', range);
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1
        console.log(parts)
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'audio/mp3',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mp3',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
}
const postMusic = async (req, res, next) => {
    // files for multiple and file for single file
    const result = await userService.createMusic(req.decode.u_id, req.file, req.body);
    return res.json(result);
}
const updateMusic = async (req, res, next) => {
    const result = await userService.updateMusic(req.params.id, req.file, req.body);
    return res.json(result);
}
const deleteMusic = async (req, res, next) => {

    const result = await userService.deleteMusic(req.decode.u_id, req.params.id);
    return res.json(result);
}
const updateDefaultMusic = async (req, res, next) => {
    const result = await userService.updateDefaultMusic(req.decode.u_id, req.params.id);
    return res.json(result);
}
const updateMsgRead = async (req, res, next) => {
    const result = await userService.updateMsgRead(req.params.id, req.body);
    return res.json(result);
}
const checkMemberWeekMonth = async (req, res, next) => {
    let data = null;
    data = await userService.checkMemberWeekMonth(req.params.u_id);
    if (data) {
        return res.json({
            success: true,
            successResponse: data,
            msg: `user is member ${data.member_type == "month" ? "of month" : "of week"}`
        });
    } else {
        return res.json({
            success: false,
            msg: "User is not member or already member"
        });
    }
}
const getAllVideos = async (req, res, next) => {
    let data = [];
    data = await userService.getAllVideos(req.query);
    if (data.videos.length > 0) {
        return res.json({
            success: true,
            successResponse: data.videos,
            count: data.count
        });
    } else {
        return res.json({
            success: false,
            msg: "Videos not found"
        });
    }
}
const getVideoByID = async (req, res, next) => {
    let data = await userService.getVideoByID(req.params.id);
    if (data.videos.length > 0) {
        return res.json({
            success: true,
            successResponse: data.videos[0]
        });
    } else {
        return res.json({
            success: false,
            msg: "Video not found"
        });
    }
}
module.exports = {
    getCountries,
    getCities,
    getUserById,
    getImagesByID,
    getAllImagesByID,
    patchUserBasic,
    sendFriendReq,
    respondFriendReq,
    checkIfFriend,
    patchProfilePic,
    addHeaderImages,
    postContactUs,
    userSearch,
    getNotifications,
    markNotification,
    getFriends,
    searchFriends,
    getMemberOfWeek,
    getMemberOfMonth,
    getLibrary,
    getAllBooksByID,
    postBook,
    updateBook,
    deleteBook,
    getAllMoviesByID,
    postMovie,
    updateMovie,
    deleteMovie,
    getAllMusicsByID,
    getMusicByID,
    startMusicStream,
    updateMsgRead,
    checkMemberWeekMonth,
    postMusic,
    updateMusic,
    deleteMusic,
    updateDefaultMusic,
    getVideoByID,
    getAllVideos
}