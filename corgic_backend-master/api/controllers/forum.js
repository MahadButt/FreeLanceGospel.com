
const ForumSection = require("../../models/ForumSection");
const forumService = require("../../services/ForumService");

const createPost = async (req, res, next) => {

    console.log(req.body)
    const result = await forumService.createPost(req.decode.u_id, req.body);
    return res.json(result);
}

const postReply = async (req, res, next) => {

    const result = await forumService.postReply(req.body, req.decode.u_id);
    return res.json(result);
}

const prepareForumPage = async (req, res, next) => {

    const posts = await forumService.prepareForumPage(req.query);
    return res.json(posts);
}

const getPostByTopicId= async (req, res, next) => {

    const posts = await forumService.getTopicPost(req.query,req.params.topic_id);
    return res.json(posts);
}

const getPostById = async (req, res, next) => {

    const u_id = req.decode ? req.decode.u_id : null;

    const post = await forumService.getPostById(req.params.post_id, u_id);
    return res.json(post);
}

const postSearch = async (req, res, next) => {

    const posts = await forumService.postSearch(req.query.search_key);
    return res.json(posts);
}

const getSectionPosts = async (req, res, next) => {

    const posts = await forumService.getSectionPosts(req.query.topic_id, req.query.section_id);
    return res.json(posts);
}

const deleteForumPost=async (req,res)=>{
    const response=await forumService.deleteForumPost(req.decode.u_id,req.params.post_id)
    return res.json(response)
}

const updateForumPost= async (req,res)=>{
    const form = JSON.parse(JSON.stringify(req.body));
    const result=await forumService.updateForumPost(req.decode.u_id,form,req.params.post_id,req.isAdmin)
    return res.json(result)
}

module.exports = {
    createPost,
    postReply,
    prepareForumPage,
    getPostByTopicId,
    getSectionPosts,
    getPostById,
    postSearch,
    updateForumPost,
    deleteForumPost
}