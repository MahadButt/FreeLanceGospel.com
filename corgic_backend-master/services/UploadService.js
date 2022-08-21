require("dotenv").config();
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_IAM_ACCESS,
    secretAccessKey: process.env.AWS_IAM_SECRET
});

const fileFilter = (req, file, cb) => {

    const allowedFileTypes = /jpeg|jpg|png|svg|tif/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extName) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type!"), false);
    }
}
const audiofileFilter = (req, file, cb) => {

    const allowedFileTypes = /mp3|aac|wav|mpeg/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extName) {
        cb(null, true);
    } else {
        cb(new Error("Audio files only!"), false);
    }
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "public/uploads/images/");
    },

    filename: function (req, file, cb) {
        cb(null, "image" + "-" + Date.now() + path.extname(file.originalname).toLowerCase());
    }

});

const audioStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "public/uploads/audio/");
    },

    filename: function (req, file, cb) {
        const filename = file.originalname.replace(/\..+$/, "");
        cb(null, "optimized-audio" + "-" + filename + "-" + Date.now() + path.extname(file.originalname).toLowerCase());
    }

});
// max size limit for a single image 10 MB; Specified in BYTES [10 * 1024 * 1024]
const uploadImageToDisk = multer({
    fileFilter,
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10 // maximum number of allowed files
    }
});
// max size limit for a single image 10 MB; Specified in BYTES [10 * 1024 * 1024]
const uploadAudioToDisk = multer({
    fileFilter: audiofileFilter,
    storage: audioStorage
});

const getPreSignedUrlS3 = async (data, image, video, pdf) => {

    try {
        let key;
        if (image) {
            key = `library/${data.name}`;
        }
        if (video) {
            key = `video/${data.name}`;
        }
        if (pdf) {
            key = `pdf/${data.name}`;
        }
        const options = {
            Bucket: process.env.AWS_USER_CDN,
            ContentType: data.type,
            Key: key,
            Expires: 5 * 60
        };

        return new Promise((resolve, reject) => {
            s3.getSignedUrl(
                "putObject", options,
                (err, url) => {
                    if (err) reject(err);
                    else resolve({ url, key });
                }
            );
        });

    } catch (err) {
        console.log(err);
    }
}

const deleteFromAWS = async (key) => {
    const options = {
        Bucket: process.env.AWS_USER_CDN,
        Key: key,
    };
    s3.deleteObject(options, function (err, data) {
        if (err) console.log(err, err.stack);  // error
        else console.log("video deleted");                 // deleted
    });
}

module.exports = {
    uploadImageToDisk,
    getPreSignedUrlS3,
    uploadAudioToDisk,
    deleteFromAWS
}