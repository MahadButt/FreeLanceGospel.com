const logger = require("../../loaders/logger");

const adminService = require("../../services/AdminService");
const authService = require("../../services/AuthService");
const uploadService = require("../../services/UploadService");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const postSignIn = async (req, res, next) => {

    try {

        const signInData = req.body;
        const data = await authService.SignInAdmin(signInData);

        if (!data.loginSuccess) {

            // INTERNAL SERVER ERROR
            logger.error(`Failed Admin SignIn, ${data.msg} => ip: ${ req.ipAddress } email: ${ signInData.email }`);   

            return res.status(200).json({
                loginSuccess: false,
                msg: data.msg
            });
        }

        logger.info(`New Admin SignIn => id: ${ data.u_id }, email: ${ data.email }`);

        return res.status(200).json(data);

    } catch (err) {
        
        logger.error(`Failed SignIn, Internal Server Error => ip: ${ req.ipAddress } email: ${ signInData.email }`);
    }
}

const getContacts = async (req, res, next) => {

    try {
     
        const msgs = await adminService.getContacts(req.query);
        return res.json(msgs);

    } catch (err) {
        logger.error(err);
    }
}

const patchContact = async (req, res, next) => {

    try {

        const result = await adminService.patchContact(req.params.id, req.body.status);
        return res.status(200).json(result);
        
    } catch (err) {
        logger.error(err);
    }
}

const generateStats = async (req, res, next) => {

    try {
        
        const data = await adminService.generateStats();
        return res.status(200).json(data);

    } catch (err) {
        logger.error(err);
    }
}

const getUsers = async (req, res, next) => {

    try {
     
        const users = await adminService.getUsers(req.query);
        return res.json(users);

    } catch (err) {
        logger.error(err);
    }
}

const patchUserStatus = async (req, res, next) => {

    try {
     
        const result = await adminService.patchUserStatus(req.params.id, req.body.status);
        return res.json(result);

    } catch (err) {
        logger.error(err);
    }
}

const getSiteStatus = async (req, res, next) => {

    try {
        
        const status = await adminService.getSiteStatus();
        return res.status(200).json(status);

    } catch (err) {
        logger.error(err);
    }
}


const insertSiteStatus = async (req, res, next) => {

    try {
        
        const result = await adminService.insertSiteStatus(req.body.status);
        return res.status(200).json(result);

    } catch (err) {
        logger.error(err);
    }
}

const createAdmin = async (req, res, next) => {

    const result = await authService.createAdmin(req.body);
    return res.json(result);
}

const newMemberOfTheWeek = async (req, res, next) => {

    const result = await adminService.newMemberOfTheWeek(req.body);
    return res.json(result);
}

const removeMemberWeek = async (req, res, next) => {

    const result = await adminService.removeMemberWeek(req.body);
    return res.json(result);
}

const getPreSignedUrl = async (req, res, next) => {

    try {
        let image = false;
        let video = false;
        let pdf = false;
        const data = { type: req.query.type, name: req.query.name };
        let type = req.query.type.split("/");
        if (type[0] == "image") {
            image = true;
        }
        if (type[0] == "video") {
            video = true;
        }
        if (type[1] == "pdf") {
            pdf = true;
        }
        const result = await uploadService.getPreSignedUrlS3(data, image, video,pdf);
        return res.json(result);
        
    } catch (err) {
        logger.error(err);
    }
}

const postLibrary = async (req, res, next) => {

    const result = await adminService.postLibrary(req.body);
    return res.json(result);
}

const getLibrary = async (req, res, next) => {

    try {
     
        const library = await adminService.getLibrary(req.query);
        return res.json(library);

    } catch (err) {
        logger.error(err);
    }
}
const getLibById = async (req, res, next) => {
    try {

        const library = await adminService.getLibById(req.params.lib_id);
        return res.json(library);
    } catch (err) {
        logger.error(err);
    }
}

const createCategory = async (req, res, next) => {
    const body = req.body;
    const result = await adminService.createCategory(body);
    return res.json(result);
}

const getCategories = async (req, res, next) => {

    const quizCategories = await adminService.getQuizCategories(req.query);
    return res.json(quizCategories);
}
const updateCategory = async (req, res, next) => {

    const result = await adminService.updateCategory(req.params.cat_id, req.body);
    return res.json(result);
}
const deleteCategory = async (req, res) => {
    const response = await adminService.deleteCategory(req.params.cat_id)
    return res.json(response)
}

const createQuizQuestion = async (req, res, next) => {
    const body = req.body;
    const result = await adminService.createQuizQuestion(body);
    return res.json(result);
}

const getQuizQuestions = async (req, res, next) => {

    const quizQuestions = await adminService.getQuizQuestions(req.query);
    return res.json(quizQuestions);
}
const updateQuizQuestion = async (req, res, next) => {

    const result = await adminService.updateQuizQuestion(req.params.question_id, req.body);
    return res.json(result);
}
const deleteQuizQuestion = async (req, res) => {
    const response = await adminService.deleteQuizQuestion(req.params.question_id)
    return res.json(response)
}
const searchQuestion = async (req, res, next) => {

    const getQuestion = await adminService.searchQuestion(req.params.cat_id,req.query);
    return res.json(getQuestion);
}
const createGalleryImages = async (req, res, next) => {
    const result = await adminService.createGalleryImages(req.files);
    return res.json(result);
}

const getImages = async (req, res, next) => {

    const galleryImages = await adminService.getImages(req.query);
    return res.json(galleryImages);
}
const deleteImage = async (req, res) => {
    const response = await adminService.deleteImage(req.params.image_id)
    return res.json(response)
}

const createBlogCategory = async (req, res, next) => {
    const body = req.body;
    const result = await adminService.createBlogCategory(body);
    return res.json(result);
}

const getBlogCategories = async (req, res, next) => {
    const quizCategories = await adminService.getBlogCategories(req.query);
    return res.json(quizCategories);
}
const updateBlogCategory = async (req, res, next) => {
    const result = await adminService.updateBlogCategory(req.params.cat_id, req.body);
    return res.json(result);
}
const createBlogSubCategory = async (req, res, next) => {
    const body = req.body;
    const result = await adminService.createBlogSubCategory(body);
    return res.json(result);
}

const getBlogSubCategories = async (req, res, next) => {
    const quizCategories = await adminService.getBlogSubCategories(req.query);
    return res.json(quizCategories);
}
const updateBlogSubCategory = async (req, res, next) => {
    const result = await adminService.updateBlogSubCategory(req.params.cat_id, req.body);
    return res.json(result);
}
const postVideo = async (req, res, next) => {

    try {
        let thumsFilePath = "";
        ffmpeg({ source: req.body.video_url })
            .on("filenames", (filenames) => {
                thumsFilePath = "uploads/thumbnails/" + filenames[0];
            })
            .on('end', async () => {
                let body = {
                    title: req.body.title,
                    description: req.body.description,
                    thumbnail: thumsFilePath,
                    video_url: req.body.video_url
                }
                const result = await adminService.postVideo(body);
                return res.json(result);
            })
            .on('error', function (err) {
                console.error(err);
            })
            .takeScreenshots({
                filename: Date.now() + "-" + 'thumbnail.png',
                timemarks: [2]
            }, './public/uploads/thumbnails');
    } catch (err) {
        logger.error(err);
    }
}
const getVideos = async (req, res, next) => {

    try {

        const videos = await adminService.getVideos(req.query);
        return res.json(videos);

    } catch (err) {
        logger.error(err);
    }
}
const deleteVideo = async (req, res) => {
    const response = await adminService.deleteVideo(req.params.id)
    return res.json(response)
}
const deleteLibrary = async (req, res) => {
    const response = await adminService.deleteLibrary(req.params.id)
    return res.json(response)
}
const updateLibrary = async (req, res) => {
    const result = await adminService.updateLibrary(req.params.lib_id, req.body);
    return res.json(result);
}
const deleteLibraryDocuments = async (req, res) => {
    const response = await adminService.deleteLibraryDocuments(req.params.id)
    return res.json(response)
}
module.exports = {
    postSignIn,
    getContacts,
    patchContact,
    generateStats,
    getUsers,
    getSiteStatus,
    patchUserStatus,
    insertSiteStatus,
    createAdmin,
    newMemberOfTheWeek,
    removeMemberWeek,
    getPreSignedUrl,
    postLibrary,
    postVideo,
    getLibrary,
    getLibById,
    getVideos,
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    createQuizQuestion,
    getQuizQuestions,
    updateQuizQuestion,
    deleteQuizQuestion,
    searchQuestion,
    createGalleryImages,
    getImages,
    deleteImage,
    deleteVideo,
    deleteLibrary,
    updateLibrary,
    createBlogCategory,
    getBlogCategories,
    updateBlogCategory,
    createBlogSubCategory,
    getBlogSubCategories,
    updateBlogSubCategory,
    deleteLibraryDocuments
}