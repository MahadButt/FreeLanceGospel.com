
const blogService = require("../../services/BlogService");

const createBlog = async (req, res, next) => {

    const form = JSON.parse(JSON.stringify(req.body));
    const result = await blogService.createBlog(req.decode.u_id, form, req.file);
    return res.json(result);
}

const getBlogCategories = async (req, res, next) => {

    const categories = await blogService.getBlogCategories();
    return res.json(categories);
}

const deleteBlog=async (req,res,next)=>{
    const result=await blogService.deleteBlog(req.decode.u_id,req.params.blog_id)
    return res.json(result)
}

const getBlogSubCat = async (req, res, next) => {

    const subCategories = await blogService.getBlogSubCat(parseInt(req.params.parent_id));
    return res.json(subCategories);
}

const getBlogs = async (req, res, next) => {

    const blogs = await blogService.getBlogs(req.params.limit, req.query);
    return res.json(blogs);
}

const getBlogById = async (req, res, next) => {

    const u_id = req.decode ? req.decode.u_id : null;

    const blog = await blogService.getBlogById(req.params.blog_id, u_id);
    return res.json(blog);
}

const blogSearch = async (req, res, next) => {

    const blogs = await blogService.blogSearch(req.query.search_key);
    return res.json(blogs);
}

const tagSearch = async (req, res, next) => {

    const tags = await blogService.tagSearch(req.query.search_key);
    return res.json(tags);
}

const postComment = async (req, res, next) => {

    const result = await blogService.postComment(req.body, req.decode.u_id);
    return res.json(result);
}
const updateBlog = async (req, res, next) => {

    const result = await blogService.updateBlog(req.params.blog_id, req.body,req.decode.u_id,req.isAdmin);
    return res.json(result);
}

module.exports = {
    createBlog,
    getBlogCategories,
    getBlogs,
    getBlogById,
    getBlogSubCat,
    blogSearch,
    tagSearch,
    postComment,
    updateBlog,
    deleteBlog
}