const logger = require("../loaders/logger");

const Blog = require("../models/Blog");
const User = require("../models/User");
const ForumPost = require("../models/ForumPost");
const ContactUs = require("../models/ContactUs");
const SiteStatus = require("../models/SiteStatus");
const MemberOfChurch = require("../models/MemberOfChurch");
const Library = require("../models/Library");
const libraryDocuments = require("../models/libraryDocuments");
const GospelVideos = require("../models/GospelVideos");
const QuizCategories = require("../models/quiz_categories");
const QuizQuestions = require("../models/quiz_questions");
const QuizOptions = require("../models/quiz_options");
const Gallery = require("../models/Gallery");
const sharp = require("sharp");
const fs = require("fs");
const BlogCat = require("../models/BlogCat");
const BlogSubCat = require("../models/BlogSubCat");
const uploadService = require("../services/UploadService");

const adminService = {

    getContacts: async function (query) {

        try {

            const msgCount = await ContactUs.query().count("id as count").where({ status: parseInt(query.status), type: query.type });
            const msgs = await ContactUs
                .query()
                .where({ status: parseInt(query.status), type: query.type })
                .orderBy("created_at", "desc")
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            if (msgs.length > 0) {
                return {
                    success: true,
                    successResponse: msgs,
                    count: msgCount ? msgCount[0].count : msgs.length
                };
            } else {
                return { success: false, msg: "Messages not found" };
            }
        } catch (err) {
            return { success: false, msg: err.message };
        }
    },

    patchContact: async function (id, status) {

        try {

            await ContactUs.query().patch({ status }).where({ id });
            return true;

        } catch (err) {

        }
    },

    generateStats: async function () {

        try {

            const [user, story, forum] = await Promise.all([
                User.query().count("u_id as count"),
                Blog.query().count("id as count"),
                ForumPost.query().count("id as count"),
            ]);

            return {
                userCount: user[0].count,
                storyCount: story[0].count,
                forumCount: forum[0].count
            };

        } catch (err) {
            logger(err);
        }
    },

    getUsers: async function (query) {

        try {

            const userCount = await User.query().count("u_id as count");

            const users = await User
                .query()
                .select("u_id", "first_name", "last_name", "avatar_url", "status", "created_at")
                .orderBy("first_name", "asc")
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));

            return {
                users,
                count: userCount ? userCount[0].count : users.length
            };

        } catch (err) {
            logger.error(err);
        }
    },

    patchUserStatus: async function (u_id, status) {

        try {

            await User.query().patch({ status }).where({ u_id });
            return { success: true };

        } catch (err) {
            logger.error(err);
        }
    },

    getSiteStatus: async function () {

        try {

            const status = await SiteStatus
                .query()
                .where({ active: 1 });

            return status;

        } catch (err) {
            logger.error(err);
        }
    },

    insertSiteStatus: async function (status) {

        try {

            await SiteStatus.query().patch({ status, active: 1 }).where({ id: 1 });
            return true;

        } catch (err) {
            logger.error(err);
        }
    },

    deleteBlog: async function (id) {

        try {

            await Blog.query().deleteById(id);
            return true;

        } catch (err) {
            logger.error(err);
        }
    },

    newMemberOfTheWeek: async function (body) {

        try {

            await MemberOfChurch.query().patch({ status: 0 }).where({ status: 1 });
            await MemberOfChurch.query().insert({ u_id: body.u_id });

            return true;

        } catch (err) {
            logger.error(err);
        }
    },

    removeMemberWeek: async function (body) {

        try {

            await MemberOfChurch.query().patch({ status: 0 }).where({ u_id: body.u_id, status: 1 });
            return true;

        } catch (err) {
            logger.error(err);
        }
    },

    postLibrary: async function (body) {

        try {

            const result = await Library.query().insert({
                title: body.title,
                description: body.description
            });

            if (result) {
                for (let i = 0; i < body.document_url.length; i++) {
                    await libraryDocuments.query().insert({
                        lib_id: result.id,
                        document_url: body.document_url[i]
                    });
                }
                return { success: true, successResponse: "library uploaded" };
            } else {
                return { success: false, successResponse: "library not uploaded" };
            }

        } catch (err) {
            logger.error(err);
            return { success: false, successResponse: err.message };
        }
    },

    getLibrary: async function (query) {

        try {

            const libCount = await Library.query().count("id as count");

            const library = await Library
                .query()
                .eager("documents")
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
    getLibById: async function (lib_id) {

        try {

            const library = await Library.query().eager("documents").findOne({ id: lib_id });

            return library;

        } catch (err) {
            logger.error(err);
        }
    },

    createCategory: async function (body) {
        try {
            const quizCat = await QuizCategories.query().insert({
                name: body.name,
                active: body.active
            });
            if (quizCat) {
                return { success: true, successResponse: "Quiz Category saved", category: quizCat };
            }
        } catch (err) {
            return { success: false, msg: err.message };
        }
    },
    getQuizCategories: async function (query) {

        try {
            let quiz_categories = [];
            quiz_categories = await QuizCategories.query()
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            const catCount = await QuizCategories.query().count("id as count");
            if (quiz_categories.length > 0) {
                return {
                    success: true,
                    successResponse: quiz_categories,
                    count: catCount ? catCount[0].count : quiz_categories.length
                };
            } else {
                return { success: false, msg: "QuizCategories not found" };
            }
        } catch (err) {
            return { success: false, msg: err.message };

        }
    },
    updateCategory: async function (cat_id, categoryData) {

        try {

            let response = await QuizCategories.query().update(categoryData).where({ id: cat_id });
            if (response && response > 0) {
                return {
                    success: true,
                    successResponse: "Category updated"
                };
            } else {
                return {
                    success: false,
                    msg: "Category not updated,Try again later"
                }
            }
        } catch (err) {

            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    deleteCategory: async function (categoryId) {
        try {
            const result = await QuizCategories.query().where({ id: categoryId })
            if (result.length > 0) {
                await QuizCategories.query().delete().where({ id: categoryId })
                return { success: true, successResponse: "Category deleted" }
            }
            else {
                return {
                    success: false,
                    msg: "Category not deleted,Try again later"
                }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message };
        }
    },
    createQuizQuestion: async function (body) {
        try {
            const quizQuestion = await QuizQuestions.query().insert({
                question: body.question,
                category_id: body.category_id,
                active: body.active
            });
            if (quizQuestion) {
                let Options = body.options;
                for (let i = 0; i < Options.length; i++) {
                    await QuizOptions.query().insert({
                        question_id: quizQuestion.id,
                        option: Options[i].option,
                        is_correct: Options[i].is_correct
                    });
                }
                return { success: true, successResponse: "Quiz Question saved", question: quizQuestion };
            }
        } catch (err) {
            return { success: false, msg: err.message };
        }
    },
    getQuizQuestions: async function (query) {

        try {
            let quiz_questions = [];
            quiz_questions = await QuizQuestions.query()
                .eager("options")
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            const questionsCount = await QuizQuestions.query().count("id as count");
            if (quiz_questions.length > 0) {
                return {
                    success: true,
                    successResponse: quiz_questions,
                    count: questionsCount ? questionsCount[0].count : quiz_questions.length
                };
            } else {
                return { success: false, msg: "QuizQuestions not found" };
            }
        } catch (err) {
            return { success: false, msg: err.message };

        }
    },
    updateQuizQuestion: async function (question_id, questionData) {

        try {

            let response = await QuizQuestions.query().update(questionData).where({ id: question_id });
            if (response && response > 0) {
                let options = questionData.options;
                for (let i = 0; i < options.length; i++) {
                    await QuizOptions.query().update(options[i]).where({ id: options[i].id });
                }
                return {
                    success: true,
                    successResponse: "QuizQuestion updated"
                };
            } else {
                return {
                    success: false,
                    msg: "Quiz Question not updated,Try again later"
                }
            }
        } catch (err) {

            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    deleteQuizQuestion: async function (questionId) {
        try {
            const result = await QuizQuestions.query().where({ id: questionId })
            if (result.length > 0) {
                await QuizQuestions.query().delete().where({ id: questionId })
                return { success: true, successResponse: "QuizQuestions deleted" }
            }
            else {
                return {
                    success: false,
                    msg: "QuizQuestions not deleted,Try again later"
                }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message };
        }
    },
    searchQuestion: async function (cat_id, query) {

        try {
            const questions = await QuizQuestions
                .query().eager("options")
                .where({ category_id: cat_id })
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            const questionsCount = await QuizQuestions.query().count("id as count").where({ category_id: cat_id });
            if (questions.length > 0) {
                return {
                    success: true,
                    successResponse: questions,
                    count: questionsCount ? questionsCount[0].count : questions.length
                };
            } else {
                return { success: false, msg: "questions not found" };
            }
        } catch (err) {
            logger.error(err)
            return { success: false, msg: err.message };
        }
    },
    createGalleryImages: async function (files) {
        let ImagesArray = [];
        for (let i = 0; i < files.length; i++) {
            const filename = files[i].originalname.replace(/\..+$/, "");
            const newFilename = `optimized-gi-${filename}-${Date.now()}.jpeg`;

            await sharp(files[i].path)
                .jpeg({ quality: 60, force: true })
                .toFile(`public/galleryImages/${newFilename}`);

            const imagePath = `galleryImages/${newFilename}`;

            fs.unlink(files[i].path, (err) => {
                if (err) throw err;
                console.log(`${files[i].path} was deleted`);
            });
            ImagesArray.push({ image_url: imagePath })
        }
        try {
            for (let i = 0; i < ImagesArray.length; i++) {
                await Gallery.query().insert(ImagesArray[i]);
            }
            return { success: true, successResponse: "uploaded" };
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }
    },
    getImages: async function (query) {

        try {
            let gallery_images = [];
            gallery_images = await Gallery.query()
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            const imagesCount = await Gallery.query().count("id as count");
            if (gallery_images.length > 0) {
                return {
                    success: true,
                    successResponse: gallery_images,
                    count: imagesCount ? imagesCount[0].count : gallery_images.length
                };
            } else {
                return { success: false, msg: "Gallery Images not found" };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };

        }
    },
    deleteImage: async function (imageID) {
        try {
            const result = await Gallery.query().where({ id: imageID });
            if (result.length > 0) {
                const response = await Gallery.query().delete().where({ id: imageID });
                if (response > 0) {
                    fs.unlinkSync(`public/${result[0].image_url}`);
                    return { success: true, successResponse: "Gallery Image deleted" }
                } else {
                    return {
                        success: false,
                        msg: "Gallery Image not deleted,Try again later"
                    }
                }
            } else {
                return {
                    success: false,
                    msg: "Gallery Image not found,Try again later"
                }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message };
        }
    },
    createBlogCategory: async function (body) {
        try {
            const blogCat = await BlogCat.query().insert({
                category_name: body.category_name,
                active: body.active
            });
            if (blogCat) {
                return { success: true, successResponse: "Blog Category saved", category: blogCat };
            }
        } catch (err) {
            return { success: false, msg: err.message };
        }
    },
    getBlogCategories: async function (query) {

        try {
            let blog_categories = [];
            blog_categories = await BlogCat.query()
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            const catCount = await BlogCat.query().count("id as count");
            if (blog_categories.length > 0) {
                return {
                    success: true,
                    successResponse: blog_categories,
                    count: catCount ? catCount[0].count : blog_categories.length
                };
            } else {
                return { success: false, msg: "BlogCategories not found" };
            }
        } catch (err) {
            return { success: false, msg: err.message };

        }
    },
    updateBlogCategory: async function (cat_id, categoryData) {

        try {

            let response = await BlogCat.query().update(categoryData).where({ id: cat_id });
            if (response && response > 0) {
                return {
                    success: true,
                    successResponse: "BlogCategory updated"
                };
            } else {
                return {
                    success: false,
                    msg: "BlogCategory not updated,Try again later"
                }
            }
        } catch (err) {

            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    createBlogSubCategory: async function (body) {
        try {
            const blogSubCat = await BlogSubCat.query().insert({
                subcat_name: body.subcat_name,
                parent_id: body.category_id
            });
            if (blogSubCat) {
                return { success: true, successResponse: "Blog SubCategory saved", blogSubCat: blogSubCat };
            }
        } catch (err) {
            return { success: false, msg: err.message };
        }
    },
    getBlogSubCategories: async function (query) {

        try {
            let blog_subcategories = [];
            let subCatCount;
            if (query.type == "all") {
                blog_subcategories = await BlogSubCat.query()
                    .limit(parseInt(query.limit))
                    .offset(parseInt(query.offset));
                subCatCount = await BlogSubCat.query().count("id as count");
            } else {
                blog_subcategories = await BlogSubCat.query()
                    .limit(parseInt(query.limit))
                    .offset(parseInt(query.offset)).where({ parent_id: query.type })
                subCatCount = await BlogSubCat.query().count("id as count").where({ parent_id: query.type })
            }
            if (blog_subcategories.length > 0) {
                return {
                    success: true,
                    successResponse: blog_subcategories,
                    count: subCatCount ? subCatCount[0].count : blog_subcategories.length
                };
            } else {
                return { success: false, msg: "BlogSubCategories not found" };
            }
        } catch (err) {
            return { success: false, msg: err.message };

        }
    },
    updateBlogSubCategory: async function (cat_id, categoryData) {

        try {

            let response = await BlogSubCat.query().update(categoryData).where({ id: cat_id });
            if (response && response > 0) {
                return {
                    success: true,
                    successResponse: "Blog SubCategory updated"
                };
            } else {
                return {
                    success: false,
                    msg: "Blog SubCategory not updated,Try again later"
                }
            }
        } catch (err) {

            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    postVideo: async function (body) {
        try {
            const result = await GospelVideos.query().insert(body);
            if (result) {
                return {
                    success: true,
                    successResponse: "Video uploaded successfully"
                }
            }
        } catch (err) {
            return {
                success: false,
                msg: err.message
            };
        }
    },
    getVideos: async function (query) {

        try {

            const vidCount = await GospelVideos.query().count("id as count");

            const videos = await GospelVideos
                .query()
                .orderBy("created_at", "desc")
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));

            return {
                success: true,
                videos,
                count: vidCount ? vidCount[0].count : videos.length
            };

        } catch (err) {
            return {
                success: false,
                msg: err.message
            };
        }
    },
    deleteVideo: async function (ID) {
        try {
            const result = await GospelVideos.query().where({ id: ID });
            if (result.length > 0) {
                const response = await GospelVideos.query().delete().where({ id: ID });
                if (response > 0) {
                    let key = result[0].video_url.split("amazonaws.com/");
                    await uploadService.deleteFromAWS(key[1])
                    return { success: true, successResponse: "Video deleted" }
                } else {
                    return {
                        success: false,
                        msg: "Video not deleted,Try again later"
                    }
                }
            } else {
                return {
                    success: false,
                    msg: "Video not found,Try again later"
                }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message };
        }
    },
    deleteLibrary: async function (ID) {
        try {
            const result = await Library.query().where({ id: ID });
            const images = await libraryDocuments.query().where({ lib_id: ID });
            if (result.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    let key = images[i].document_url.split("amazonaws.com/");
                    await uploadService.deleteFromAWS(key[1])
                }
                const response = await Library.query().delete().where({ id: ID });
                if (response > 0) {
                    return { success: true, successResponse: "Library deleted" }
                } else {
                    return {
                        success: false,
                        msg: "Library not deleted,Try again later"
                    }
                }
            } else {
                return {
                    success: false,
                    msg: "Library not found,Try again later"
                }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message };
        }
    },
    updateLibrary: async function (lib_id, libData) {

        try {
            let body = {
                title: libData.title,
                description: libData.description
            }
            let response = await Library.query().update(body).where({ id: lib_id });
            if (response && response > 0) {
                if (libData.document_url && libData.document_url.length > 0) {
                    for (let i = 0; i < libData.document_url.length; i++) {
                        await libraryDocuments.query().insert({
                            lib_id: lib_id,
                            document_url: libData.document_url[i]
                        });
                    }
                }
                return {
                    success: true,
                    successResponse: "Library updated"
                };
            } else {
                return {
                    success: false,
                    msg: "Library not updated,Try again later"
                }
            }
        } catch (err) {

            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
    deleteLibraryDocuments: async function (ID) {
        try {
            const result = await libraryDocuments.query().where({ id: ID });
            if (result.length > 0) {
                const response = await libraryDocuments.query().delete().where({ id: ID });
                if (response > 0) {
                    let key = result[0].document_url.split("amazonaws.com/");
                    await uploadService.deleteFromAWS(key[1])
                    return { success: true, successResponse: "Lib Document deleted" }
                } else {
                    return {
                        success: false,
                        msg: "Lib Document not deleted,Try again later"
                    }
                }
            } else {
                return {
                    success: false,
                    msg: "Lib Document not found,Try again later"
                }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message };
        }
    },
}

module.exports = adminService;