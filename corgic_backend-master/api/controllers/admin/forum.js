
const ForumSection = require("../../../models/ForumSection");
const forumService = require("../../../services/admin/ForumService");

const getForumPosts = async (req, res, next) => {
    const forumPosts = await forumService.getForumPosts(req.query);
    return res.json(forumPosts);
}

const updateForumPost = async (req, res) => {
    const form = JSON.parse(JSON.stringify(req.body));
    const result = await forumService.updateForumPost(form, req.params.post_id)
    return res.json(result)
}
const createForumTopic = async (req, res, next) => {

    const result = await forumService.createForumTopic(req.body);
    return res.json(result);
}

const getForumTopics = async (req, res, next) => {
    const forumPosts = await forumService.getForumTopics(req.query);
    return res.json(forumPosts);
}

const updateForumTopic = async (req, res) => {
    const form = JSON.parse(JSON.stringify(req.body));
    const result = await forumService.updateForumTopic(form, req.params.topic_id)
    return res.json(result)
}

const createForumSection = async (req, res, next) => {

    const result = await forumService.createForumSection(req.body);
    return res.json(result);
}

const getForumSections = async (req, res, next) => {
    const forumPosts = await forumService.getForumSections(req.query);
    return res.json(forumPosts);
}

const updateForumSection = async (req, res) => {
    const form = JSON.parse(JSON.stringify(req.body));
    const result = await forumService.updateForumSection(form, req.params.section_id)
    return res.json(result)
}

module.exports = {
    getForumPosts,
    updateForumPost,
    createForumTopic,
    getForumTopics,
    updateForumTopic,
    createForumSection,
    getForumSections,
    updateForumSection,
}