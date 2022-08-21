const logger = require("../loaders/logger");
const Chapter = require("../models/Chapter");
const chapService = {

    createChapter: async function (u_id, body) {
        try {
            const chapter = await Chapter.query().insert({
                u_id,
                title: body.title,
                description: body.description
            });
            if (chapter) {
                return { success: true, successResponse: "Chapter saved", chapter: chapter };
            }
        } catch (err) {
            logger.error(err);
            return { success: false, msg: err.message };
        }
    },
    getChapters: async function (u_id) {

        try {
            let chapters = [];
            chapters = await Chapter.query().where({ u_id });
            if (chapters.length > 0) {
                return {
                    success: true,
                    successResponse: chapters
                };
            } else {
                return { success: false, msg: "Chapters not found" };
            }
        } catch (err) {
            logger.error(err.message);
            return { success: false, msg: err.message };

        }
    },
    updateChapter: async function (chap_id, chapterData) {

        try {

            let response = await Chapter.query().update(chapterData).where({ id: chap_id });
            if (response && response > 0) {
                return {
                    success: true,
                    successResponse: "Chapter updated"
                };
            } else {
                return {
                    success: false,
                    msg: "Chapter not updated,Try again later"
                }
            }
        } catch (err) {

            logger.error(err);
            return { success: false, msg: err.message };
        }

    },

}

module.exports = chapService;