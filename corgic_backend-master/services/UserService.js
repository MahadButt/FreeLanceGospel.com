
const logger = require("../loaders/logger");
const sharp = require("sharp");
const moment = require("moment");
const fs = require("fs");
const knex = require('knex')

const User = require("../models/User");
const UserImage = require("../models/UserImages");
const CountryMap = require("../models/CountryMap");
const City = require("../models/City");
const ContactUs = require("../models/ContactUs");
const MemberOfChurch = require("../models/MemberOfChurch");
const Library = require("../models/Library");
const Books = require("../models/Books");
const Movies = require("../models/Movies");
const Musics = require("../models/Musics");

const authService = require("./AuthService");
const friendService = require("./FriendService");

const { friendReqStatus } = require("../utils/consts");
const GospelVideo = require("../models/GospelVideos");

const userService = {

    prunObject: function (obj) {

        const prunedObj = { ...obj };

        Object.keys(prunedObj).forEach(key => {

            if (prunedObj[key] === "" || prunedObj[key] === null || prunedObj[key] === undefined || prunedObj[key] === NaN) {
                delete prunedObj[key];
            }
        });

        return prunedObj;
    },

    compareAndRemove: function (target, source) {

        target = { ...target };

        Object.keys(target).forEach(key => {

            if (target[key] === source[key]) {
                delete target[key];
            }
        });

        return target;
    },

    getCountries: async function () {
        const countries = await CountryMap.query();
        return countries;
    },
    getCities: async function () {
        const cities = await City.query();
        return cities;
    },
    getUserById: async function (u_id, isOwnProfile) {

        let user = null;

        if (isOwnProfile) {

            user = await User.query()
                .select(
                    "first_name",
                    "last_name",
                    "email",
                    "address",
                    "date_of_birth",
                    "church_title",
                    "marital_status",
                    "denomination",
                    "avatar_url",
                    "contact_no",
                    "status",
                    "last_login",
                    "created_at",
                    "age",
                    "ethnicity",
                    "region",
                    "sign",
                    "education",
                    "hobbies"
                )
                .findOne({ u_id }).eager("[country,city]");

        } else {

            user = await User.query()
                .select(
                    "u_id",
                    "first_name",
                    "last_name",
                    "avatar_url",
                    "church_title",
                    "denomination",
                    "email",
                    "address",
                    "date_of_birth",
                    "marital_status",
                    "contact_no",
                    "status",
                    "last_login",
                    "created_at",
                    "age",
                    "ethnicity",
                    "region",
                    "sign",
                    "education",
                    "hobbies"
                )
                .findOne({ u_id }).eager("[country,city]");
        }

        return user;
    },
    getHeaderImageById: async function (u_id) {
        let user = await UserImage.query()
            .select("*")
            .findOne({ u_id, is_header_image: 1 }).orderBy("created_at", "desc");
        return user;
    },
    getAllImagesById: async function (u_id, query) {
        try {
            let images = null;
            let imagesCount = null;
            imagesCount = await UserImage.query().count("id as count").where({ u_id });
            images = await UserImage.query().select("id", "image_url").where({ u_id })
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            return {
                images,
                count: imagesCount && imagesCount[0].count
            };
        } catch (err) {
            logger.error(err)
        }
    },
    getProfileImagesForSliderById: async function (u_id) {
        let user = await UserImage.query()
            .select("id", "image_url", "is_header_image")
            .where({ u_id, is_header_image: 0 });
        return user;
    },
    getHeaderImagesForSliderById: async function (u_id) {
        let user = await UserImage.query()
            .select("id", "image_url", "is_header_image")
            .where({ u_id, is_header_image: 1 });
        return user;
    },
    patchUserBasic: async function (u_id, updateData) {

        try {

            delete updateData.profile_pic;
            delete updateData.header_pic;
            updateData = this.prunObject(updateData);

            if (updateData.password && updateData.re_password) {

                if (updateData.password === updateData.re_password) {

                    const result = await authService.changeUserPassword(u_id, updateData.password);

                    if (!result.passChange) {
                        return { update: false, msg: "Internal Server Error! Try gaian Later." };
                    }

                    delete updateData.password;
                    delete updateData.re_password;

                } else {
                    return { update: false, msg: "Passwords do not match!" };
                }

            } else {
                delete updateData.password;
                delete updateData.re_password;
            }

            const user = await User.query().findOne({ u_id });
            updateData = this.compareAndRemove(updateData, user);

            await User.query().patch(updateData).where({ u_id });
            return { update: true, msg: "Profile Updated!" };

        } catch (err) {

            logger.error(err);
            return { update: false, msg: "Internal Server Error!" };
        }

    },

    patchProfilePic: async function (u_id, files) {
        let ImagesArray = [];
        for (let i = 0; i < files.length; i++) {
            const filename = files[i].originalname.replace(/\..+$/, "");
            const newFilename = `optimized-pp-${filename}-${Date.now()}.jpeg`;

            await sharp(files[i].path)
                .jpeg({ quality: 60, force: true })
                .toFile(`public/uploads/images/${newFilename}`);

            const imagePath = `uploads/images/${newFilename}`;

            fs.unlink(files[i].path, (err) => {
                if (err) throw err;
                console.log(`${files[i].path} was deleted`);
            });
            ImagesArray.push({ u_id: u_id, image_url: imagePath })
        }
        try {
            let update = await User.query().patch({ avatar_url: ImagesArray[0].image_url }).where({ u_id });
            if (update > 0) {
                for (let i = 0; i < ImagesArray.length; i++) {
                    await UserImage.query().insert(ImagesArray[i]);
                }
                return { ppChange: true, url: ImagesArray[0].image_url };
            }
        } catch (err) {
            logger.error(err);
            return { ppChange: false };
        }
    },
    addHeaderImages: async function (u_id, files) {
        let ImagesArray = [];
        for (let i = 0; i < files.length; i++) {
            const filename = files[i].originalname.replace(/\..+$/, "");
            const newFilename = `optimized-pp-${filename}-${Date.now()}.jpeg`;

            await sharp(files[i].path)
                .jpeg({ quality: 60, force: true })
                .toFile(`public/uploads/images/${newFilename}`);

            const imagePath = `uploads/images/${newFilename}`;

            fs.unlink(files[i].path, (err) => {
                if (err) throw err;
                console.log(`${files[i].path} was deleted`);
            });
            ImagesArray.push({ u_id: u_id, is_header_image: 1, image_url: imagePath })
        }
        try {
            for (let i = 0; i < ImagesArray.length; i++) {
                await UserImage.query().insert(ImagesArray[i]);
            }
            return { success: true, successResponse: "uploaded" };
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }
    },

    postContactUs: async function (data) {

        try {

            await ContactUs.query().insert({
                name: data.name,
                email: data.email,
                contact_no: data.contact_no,
                message: data.message,
                type: data.type,
                status: 1
            });

            return { success: true, msg: "Message sent!" };

        } catch (err) {

            logger.error("Error in UserService.postContactUs");
            logger.error(err);
            return { success: false, msg: "Internal Server Error!" };
        }
    },

    userSearch: async function (query, u_id) {

        try {
            let users = [];
            let userCount = [];
            if ((query.search_key || query.denomination || query.country || query.city) && !query.limit) {
                var data = await User.query().leftJoinRelation('[country,city]').eager('[country,city]').orWhere('city.name', 'like', `%${query.city}%`).orWhere('country.country_name', 'like', `%${query.country}%`)
                    .orWhere('first_name', 'like', `%${query.search_key}%`).orWhere('last_name', 'like', `%${query.search_key}%`).orWhereRaw(`concat(first_name,' ',last_name) like '%${query.search_key}%'`)
                    .orWhere('email', 'like', `%${query.search_key}%`).orWhere('denomination', 'like', `${query.denomination}`);
                users = data;

            } else if ((query.search_key || query.denomination || query.country || query.city) && query.limit && query.type !== "all") {
                var datauserCount = await User.query().leftJoinRelation('[country,city]').eager('[country,city]').orWhere('city.name', 'like', `%${query.city}%`).orWhere('country.country_name', 'like', `%${query.country}%`)
                    .orWhere('first_name', 'like', `%${query.search_key}%`).orWhere('last_name', 'like', `%${query.search_key}%`).orWhereRaw(`concat(first_name,' ',last_name) like '%${query.search_key}%'`)
                    .orWhere('email', 'like', `%${query.search_key}%`).orWhere('denomination', 'like', `${query.denomination}`);
                userCount = datauserCount;
                var data = await User.query().leftJoinRelation('[country,city]').eager('[country,city]').orWhere('city.name', 'like', `%${query.city}%`).orWhere('country.country_name', 'like', `%${query.country}%`)
                    .orWhere('first_name', 'like', `%${query.search_key}%`).orWhere('last_name', 'like', `%${query.search_key}%`).orWhereRaw(`concat(first_name,' ',last_name) like '%${query.search_key}%'`)
                    .orWhere('email', 'like', `%${query.search_key}%`).orWhere('denomination', 'like', `${query.denomination}`).limit(parseInt(query.limit)).offset(parseInt(query.offset));
                users = data;
            } else if (query.type === "all") {

                userCount = await User.query();

                users = await User
                    .query()
                    .select("u_id", "first_name", "last_name", "avatar_url", "created_at")
                    .orderBy("first_name", "asc")
                    .limit(parseInt(query.limit))
                    .offset(parseInt(query.offset));
            }

            const friendList = await friendService.getFriends(u_id);

            const acceptedFriendList = [];
            const pendingList = [];

            friendList.forEach(friend => {

                if (friend.status === friendReqStatus.ACCEPTED) {
                    acceptedFriendList.push(friend.friend_id);
                } else if (friend.status === friendReqStatus.PENDING || friend.status === friendReqStatus.SENDER) {
                    pendingList.push(friend.friend_id);
                }

            });

            users.forEach(user => {

                if (acceptedFriendList.includes(user.u_id)) {
                    user.isFriend = true;
                } else if (pendingList.includes(user.u_id)) {
                    user.isPending = true;
                }
            });

            return {
                users,
                count: userCount.length > 0 ? userCount.length : users.length
            };

        } catch (err) {
            logger.error(err)
        }
    },

    getMemberOfWeek: async function () {

        try {

            const member = await MemberOfChurch.query().eager("user").findOne({ status: 1, member_type: "week" });
            return member;

        } catch (err) {
            logger.error(err);
        }
    },
    getMemberOfMonth: async function () {

        try {

            const member = await MemberOfChurch.query().eager("user").findOne({ status: 1, member_type: "month" });
            return member;

        } catch (err) {
            logger.error(err);
        }
    },


    getLibrary: async function (query) {

        try {

            const libCount = await Library.query().count("id as count");

            const library = await Library
                .query()
                .orderBy("created_at", "desc")
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));

            return {
                library,
                count: libCount ? libCount[0].count : library.length
            };

        } catch (err) {
            logger.error(err);
        }
    },
    //Favourites Books
    getAllBooksByID: async function (u_id, query) {
        try {
            let books = null;
            let booksCount = null;
            booksCount = await Books.query().count("id as count").where({ u_id });
            books = await Books.query().select("id", "title").where({ u_id })
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            return {
                books,
                count: booksCount && booksCount[0].count
            };
        } catch (err) {
            logger.error(err)
        }
    },
    createBook: async function (u_id, body) {
        try {
            const book = await Books.query().insert({
                u_id,
                title: body.title,
                // description: body.description
            });
            if (book) {
                return { success: true, successResponse: "Book saved", book: book };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }
    },
    updateBook: async function (id, updateData) {

        try {
            updateData = this.prunObject(updateData);
            let update = await Books.query().patch({ title: updateData.title }).where({ id });
            if (update > 0) {
                return { success: true, successResponse: "Book updated" };
            } else {
                return { success: false, msg: "Book not updated" };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    deleteBook: async function (u_id, id) {

        try {
            let book = await Books.query().deleteById(id);
            if (book) {
                booksCount = await Books.query().count("id as count").where({ u_id });
                return { success: true, successResponse: "Book deleted successfully", count: booksCount[0].count };
            } else {
                return { success: false, msg: "Book not deleted" };
            }

        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }
    },
    //Favourites Movies
    getAllMoviesByID: async function (u_id, query) {
        try {
            let movies = null;
            let moviesCount = null;
            moviesCount = await Movies.query().count("id as count").where({ u_id });
            movies = await Movies.query().select("id", "title").where({ u_id })
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            return {
                movies,
                count: moviesCount && moviesCount[0].count
            };
        } catch (err) {
            logger.error(err)
        }
    },
    createMovie: async function (u_id, body) {
        try {
            const movie = await Movies.query().insert({
                u_id,
                title: body.title,
                // description: body.description
            });
            if (movie) {
                return { success: true, successResponse: "Movie saved", movie: movie };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }
    },
    updateMovie: async function (id, updateData) {

        try {
            updateData = this.prunObject(updateData);
            let update = await Movies.query().patch({ title: updateData.title }).where({ id });
            if (update > 0) {
                return { success: true, successResponse: "Movie updated" };
            } else {
                return { success: false, msg: "Movie not updated" };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    deleteMovie: async function (u_id, id) {

        try {
            let movie = await Movies.query().deleteById(id);
            if (movie) {
                moviesCount = await Movies.query().count("id as count").where({ u_id });
                return { success: true, successResponse: "Movie deleted successfully", count: moviesCount[0].count };
            } else {
                return { success: false, msg: "Movie not deleted" };
            }

        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }
    },
    //Favourites Musics
    getAllMusicsByID: async function (u_id, query) {
        try {
            let musics = null;
            let musicsCount = null;
            musicsCount = await Musics.query().count("id as count").where({ u_id });
            musics = await Musics.query().select("id", "title", "file_path", "is_default").where({ u_id })
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            return {
                musics,
                count: musicsCount && musicsCount[0].count
            };
        } catch (err) {
            logger.error(err)
        }
    },
    getMusicByID: async function (id) {
        try {
            let musics = null;
            musics = await Musics.query().select("id", "title", "file_path").where({ id })
            return {
                musics,
            };
        } catch (err) {
            logger.error(err)
        }
    },
    getDefaultMusic: async function (u_id) {
        try {
            let music = null;
            music = await Musics.query().select("id", "title", "file_path", "is_default").where({ u_id: u_id, is_default: 1 })
            return {
                music: (music && music.length > 0) ? music : null
            };
        } catch (err) {
            logger.error(err)
        }
    },
    createMusic: async function (u_id, file, body) {
        try {
            const imagePath = `uploads/audio/${file.filename}`;
            const music = await Musics.query().insert({
                u_id,
                title: body.title,
                file_path: imagePath
                // description: body.description
            });
            if (music) {
                return { success: true, successResponse: "Music saved", music: music };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }
    },
    updateMusic: async function (id, file, updateData) {

        try {
            let Music = await Musics.query().where({ id })
            if (Music && Music.length > 0) {
                updateData = this.prunObject(updateData);
                if (file) {
                    fs.unlinkSync(`public/${Music[0].file_path}`, (err) => {
                        if (err) throw err;
                        console.log(`${Music[0].file_path} was deleted`);
                    });
                    const imagePath = `uploads/audio/${file.filename}`;
                    updateData.file_path = imagePath;
                }
                let update = await Musics.query().patch({ title: updateData.title, file_path: updateData.file_path }).where({ id });
                if (update > 0) {
                    return { success: true, successResponse: "Music updated" };
                } else {
                    return { success: false, msg: "Music not updated" };
                }
            } else {
                return { success: false, msg: "Music not found" };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    updateDefaultMusic: async function (u_id, id) {

        try {
            let Music = await Musics.query().where({ id })
            if (Music && Music.length > 0) {
                let update = await Musics.query().update({
                    is_default: knex.raw(`case when id = ${id} then '1' else '0' end`)
                }).where('u_id', u_id)
                if (update > 0) {
                    return { success: true, successResponse: "Music updated" };
                } else {
                    return { success: false, msg: "Music not updated" };
                }
            } else {
                return { success: false, msg: "Music not found" };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    deleteMusic: async function (u_id, id) {

        try {
            let Music = await Musics.query().where({ id })
            if (Music && Music.length > 0) {
                await Musics.query().deleteById(id);
                fs.unlinkSync(`public/${Music[0].file_path}`, (err) => {
                    if (err) throw err;
                    console.log(`${Music[0].file_path} was deleted`);
                });
                MusicsCount = await Musics.query().count("id as count").where({ u_id });
                return { success: true, successResponse: "Music deleted successfully", count: MusicsCount[0].count };
            } else {
                return { success: false, msg: "Music not deleted" };
            }

        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }
    },
    getRandomUserForMemberShip: async function (id) {
        try {
            let user = null;
            user = await User.query().orderByRaw('RAND()').limit(1)
            return {
                user,
            };
        } catch (err) {
            logger.error(err)
        }
    },
    checkUserForMembertype: async function (member_type) {

        let user = null;

        user = await MemberOfChurch.query().where({ member_type:member_type });

        return { user: user };
    },
    saveUserAsMember: async (data) => {
        try {
            const memberofWeek = await MemberOfChurch.query().insert(data);
            if (memberofWeek) {
                return { success: true };
            }
        } catch (err) {
            return { success: false, msg: err.message };
        }
    },
    updateMember: async function (old_user_id, new_u_id) {

        try {
            let update = await MemberOfChurch.query().patch({ u_id: new_u_id, isRead: 0, description: null, created_at: moment().format("YYYY-MM-DD HH:mm:ss") }).where({ id: old_user_id });
            if (update > 0) {
                return { success: true, successResponse: "Member Updated" };
            } else {
                return { success: false, msg: "Member not updated" };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    updateMsgRead: async function (id, body) {

        try {
            let update = await MemberOfChurch.query().patch({ isRead: 1, description: body.description }).where({ id: id });
            if (update > 0) {
                return { success: true, successResponse: "Member Updated" };
            } else {
                return { success: false, msg: "Member not updated" };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    checkMemberWeekMonth: async function (u_id) {

        try {

            const member = await MemberOfChurch.query().eager("user").findOne({ status: 1, isRead: 0, u_id: u_id });
            return member;

        } catch (err) {
            logger.error(err);
        }
    },
    getAllVideos: async function (query) {
        try {
            let videos = null;
            let videosCount = null;
            videosCount = await GospelVideo.query().count("id as count");
            videos = await GospelVideo.query().limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            return {
                videos,
                count: videosCount ? videosCount[0].count : videos.length
            };
        } catch (err) {
            logger.error(err)
        }
    },
    getVideoByID: async function (id) {
        try {
            let videos = null;
            videos = await GospelVideo.query().where({ id })
            return {
                videos,
            };
        } catch (err) {
            logger.error(err)
        }
    },
}

module.exports = userService;
