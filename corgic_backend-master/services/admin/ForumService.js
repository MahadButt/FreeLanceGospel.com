const logger = require("../../loaders/logger");

const ForumTopic = require("../../models/ForumTopic");
const ForumSection = require("../../models/ForumSection");
const ForumPost = require("../../models/ForumPost");
const ForumReply = require("../../models/ForumReply");

const adminForumService = {

    getForumPosts: async function (query) {

        try {
            let forum_posts = [];
            forum_posts = await ForumPost.query()
                .eager("[topic,section]")
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            const forumpostCount = await ForumPost.query().count("id as count");
            if (forum_posts.length > 0) {
                return {
                    success: true,
                    successResponse: forum_posts,
                    count: forumpostCount ? forumpostCount[0].count : forum_posts.length
                };
            } else {
                return { success: false, msg: "forumPosts not found" };
            }
        } catch (err) {
            return { success: false, msg: err.message };

        }
    },
    updateForumPost: async function (data, forumId) {
        try {
            let response;
            response = await ForumPost.query().update(data).where({ id: forumId })
            if (response && response > 0) {
                return {
                    success: true,
                    successResponse: "ForumPost updated"
                };
            } else {
                return {
                    success: false,
                    msg: "ForumPost not updated,Try again later"
                }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message }
        }
    },
    createForumTopic: async function (data) {

        try {
            const result = await ForumTopic
                .query()
                .insert(data);
            if (result) {
                return { success: true, "successResponse": "ForumTopic saved", forumTopic: result };
            } else {
                return { success: false, msg: "ForumTopic not saved" };
            }

        } catch (err) {
            return { success: false, msg: err.message };
        }
    },

    getForumTopics: async function (query) {

        try {
            let forum_topics = [];
            forum_topics = await ForumTopic.query()
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
            const forumTopicCount = await ForumTopic.query().count("id as count");
            if (forum_topics.length > 0) {
                return {
                    success: true,
                    successResponse: forum_topics,
                    count: forumTopicCount ? forumTopicCount[0].count : forum_topics.length
                };
            } else {
                return { success: false, msg: "forumTopics not found" };
            }
        } catch (err) {
            return { success: false, msg: err.message };

        }
    },
    updateForumTopic: async function (data, forumId) {
        try {
            let response;
            response = await ForumTopic.query().update(data).where({ id: forumId })
            if (response && response > 0) {
                return {
                    success: true,
                    successResponse: "ForumTopic updated"
                };
            } else {
                return {
                    success: false,
                    msg: "ForumTopic not updated,Try again later"
                }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message }
        }
    },
    createForumSection: async function (data) {

        try {
            const result = await ForumSection
                .query()
                .insert(data);
            if (result) {
                return { success: true, "successResponse": "ForumSection saved", forumSection: result };
            } else {
                return { success: false, msg: "ForumSection not saved" };
            }

        } catch (err) {
            return { success: false, msg: err.message };
        }
    },

    getForumSections: async function (query) {

        try {
            let forum_Sections = [];
            let forumSectionCount = [];
            if (query.topic_id) {
                forum_Sections = await ForumSection.query()
                    .where({ topic_id: query.topic_id })
                    .limit(parseInt(query.limit))
                    .offset(parseInt(query.offset));
                forumSectionCount = await ForumSection.query().where({ topic_id: query.topic_id }).count("id as count");
            } else {
                forum_Sections = await ForumSection.query()
                    .limit(parseInt(query.limit))
                    .offset(parseInt(query.offset));
                forumSectionCount = await ForumSection.query().count("id as count");
            }
            if (forum_Sections.length > 0) {
                return {
                    success: true,
                    successResponse: forum_Sections,
                    count: forumSectionCount ? forumSectionCount[0].count : forum_Sections.length
                };
            } else {
                return { success: false, msg: "forumSections not found" };
            }
        } catch (err) {
            return { success: false, msg: err.message };

        }
    },
    updateForumSection: async function (data, forumId) {
        try {
            let response;
            response = await ForumSection.query().update(data).where({ id: forumId })
            if (response && response > 0) {
                return {
                    success: true,
                    successResponse: "ForumSection updated"
                };
            } else {
                return {
                    success: false,
                    msg: "ForumSection not updated,Try again later"
                }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message }
        }
    },

}

module.exports = adminForumService;