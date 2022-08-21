const logger = require("../loaders/logger");
const { transaction } = require("objection");
const fs = require("fs");
const sharp = require("sharp");

const Chapter = require("../models/Chapter");
const Blog = require("../models/Blog");
const BlogCat = require("../models/BlogCat");
const BlogSubCat = require("../models/BlogSubCat");
const BlogComment = require("../models/BlogComment");
const Tag = require("../models/Tag");
const BlogTag = require("../models/BlogTag");
const { parse } = require("path");
const User = require("../models/User");

const blogService = {

    getBlogCategories: async function () {

        try {
            const categories = await BlogCat.query().where({ active: 1 });
            if (categories.length > 0) {
                for (let i = 0; i < categories.length; i++) {
                    const subCategories = await BlogSubCat.query().where({ parent_id: categories[i].id, active: 1 });
                    categories[i].subCats = subCategories
                }
                return categories;
            } else {
                return { success: false, msg: "categories not found" }
            }
        } catch (err) {
            return { success: false, msg: err.message }
        }
    },
    deleteBlog: async function (u_id, blog_id) {
        try {
            const blog = await Blog.query().where({ u_id: u_id, id: blog_id })
            if (blog.length > 0) {
                fs.unlinkSync(`public/${blog[0].banner_img_url}`)
                fs.unlinkSync(`public/${blog[0].preview_url}`)
                await Blog.query().delete().where({ u_id: u_id, id: blog_id })
                return { success: true, error: false }
            }
            else {
                return { success: false, error: false }
            }
        }
        catch (er) {
            logger.error(er)
            return { success: false, error: er.message }
        }
    },

    getBlogSubCat: async function (parent_id) {

        try {

            const subCategories = await BlogSubCat.query().where({ parent_id: parent_id, active: 1 });
            return subCategories;

        } catch (err) {
            logger.error(err);
        }
    },

    createBlog: async function (u_id, form, image) {

        async function convertToJPEG() {

            const filename = image.originalname.replace(/\..+$/, "");
            const newFilename = `optimized-${filename}-${Date.now()}.jpeg`;

            await sharp(image.path)
                .jpeg({ quality: 80, force: true })
                .toFile(`public/uploads/images/${newFilename}`);

            return `uploads/images/${newFilename}`;
        }

        async function createPreview() {

            const previewFilename = image.originalname.replace(/\..+$/, "");
            const previewNewFilename = `preview-${previewFilename}-${Date.now()}.jpeg`;

            await sharp(image.path)
                .resize(280, 220, {
                    fit: "cover"
                })
                .jpeg({ quality: 90, force: true })
                .toFile(`public/uploads/images/${previewNewFilename}`);

            return `uploads/images/${previewNewFilename}`;
        }

        const [imagePreviewPath, bannerImagePath] = await Promise.all([createPreview(), convertToJPEG()]);

        fs.unlink(image.path, (err) => {
            if (err) throw err;
            console.log(`${image.path} was deleted`);
        });

        const tag_list = JSON.parse(form.tag_list);

        form.category = parseInt(form.category);

        try {

            const result = await transaction(Blog.knex(), async (trx) => {

                const blog = await Blog.query(trx).insert({
                    u_id,
                    title: form.title,
                    sub_title: form.sub_title,
                    description: form.description,
                    cat_id: form.cat_id,
                    subcat_id: form.subcat_id,
                    chapter_id: form.chapter_id,
                    banner_img_url: bannerImagePath,
                    preview_url: imagePreviewPath
                });

                for (let i = 0; i < tag_list.length; i++) {

                    let tagId = -1;

                    if (tag_list[i].id === "new") {

                        const tag = await Tag.query(trx).insert({
                            tag_name: tag_list[i].title
                        });

                        tagId = tag.id;

                    } else {
                        tagId = tag_list[i].id;
                    }

                    await BlogTag.query(trx).insert({
                        blog_id: blog.id,
                        tag_id: tagId
                    });
                }

                return { success: true, blog_id: blog.id };
            });

            if (result.success) {
                return { success: true, blog_id: result.blog_id };
            }

        } catch (err) {
            logger.error(err);
            return { success: false };
        }
    },

    getBlogs: async function (limit, filters) {

        try {
            let blogs = [];
            let user = null;
            let chapter = null;
            let count = 0;
            blogs = await Blog.query()
                .select("id", "title", "preview_url", "created_at")
                .eager("[user, category, sub_category,chapter]").limit(limit)
                .orderBy("created_at", "desc");

            count = await Blog.query().count("id as count")

            if (filters.cat_id && !filters.subcat_id) {
                blogs = await Blog.query()
                    .select("id", "title", "preview_url", "created_at")
                    .eager("[user, category, sub_category]").where("cat_id", parseInt(filters.cat_id)).limit(limit)
                    .orderBy("created_at", "desc");

                count = await Blog.query().where("cat_id", parseInt(filters.cat_id)).count("id as count")
            }
            if (filters.subcat_id) {
                blogs = await Blog.query()
                    .select("id", "title", "preview_url", "created_at")
                    .eager("[user, category, sub_category,chapter]").where("cat_id", parseInt(filters.cat_id)).where("subcat_id", parseInt(filters.subcat_id))
                    .limit(limit)
                    .orderBy("created_at", "desc");

                count = await Blog.query().where("cat_id", parseInt(filters.cat_id))
                    .where("subcat_id", parseInt(filters.subcat_id))
                    .count("id as count")

            }
            if (filters.chap_id) {
                blogs = await Blog.query()
                    .select("id", "title", "preview_url", "created_at")
                    .eager("[user, category, sub_category,chapter]").where("chapter_id", parseInt(filters.chap_id)).limit(limit)
                    .orderBy("created_at", "desc");

                count = await Blog.query().where("chapter_id", parseInt(filters.chap_id)).count("id as count")
                chapter = await Chapter.query().findOne({ id: filters.chap_id });
            }
            if (chapter) {
                user = await User.query().findOne({ u_id: chapter.u_id });
            }
            if (blogs.length > 0) {
                return {
                    success: true,
                    count: count[0].count,
                    user: user ? user : null,
                    chapter: chapter ? chapter : null,
                    blogs: blogs
                };
            } else {
                return {
                    success: false,
                    user: user ? user : null,
                    chapter: chapter ? chapter : null,
                    successResponse: "blogs not found"
                };
            }
        } catch (err) {
            logger.error(err.message);
            return {
                success: false,
                successResponse: err.message
            };
        }
    },

    getBlogById: async function (blog_id, u_id) {

        try {

            if (blog_id !== "none") {

                const blog = await Blog.query()
                    .select("id", "title", "sub_title", "description", "banner_img_url", "status", "created_at")
                    .eager("[user, category, sub_category,chapter, tags.tag, comments.user]")
                    .findOne({ id: blog_id });

                return blog;

            } else if (u_id) {

                const blogs = await Blog.query()
                    .select("id", "title", "preview_url", "description")
                    .eager("[user, category, sub_category,chapter]")
                    .orderBy("created_at", "desc")
                    .where({ u_id });

                return blogs;
            }

        } catch (err) {
            logger.error(err);
        }
    },

    blogSearch: async function (searchKey) {

        try {

            const blogs = await Blog
                .query()
                .eager("[user, category, sub_category]")
                .orWhere("title", "like", `%${searchKey}%`)
                .orWhere("description", "like", `%${searchKey}%`);

            return blogs;

        } catch (err) {
            logger.error(err)
        }
    },

    tagSearch: async function (searchKey) {

        try {

            const tags = await Tag.query().where("tag_name", "like", `%${searchKey}%`)
            return tags;

        } catch (err) {
            logger.error(err)
        }
    },

    postComment: async function (data, u_id) {

        try {

            const result = await BlogComment.query().insert({
                u_id,
                blog_id: data.blog_id,
                comment: data.comment
            });

            if (!result) {
                return { success: false };
            }

            return { success: true };

        } catch (err) {
            logger.error(err);
        }
    },
    updateBlog: async function (blog_id, blogData, u_id, isAdmin) {

        try {
            let response;
            if (isAdmin) {
                response = await Blog.query().update(blogData).where({ id: blog_id });
            }
            else {
                response = await Blog.query().update(blogData).where({ u_id: u_id, id: blog_id });
            }

            if (response && response > 0) {
                return {
                    success: true,
                    successResponse: "Blog updated"
                };
            } else {
                return {
                    success: false,
                    msg: "Blog not updated,Try again later"
                }
            }
        } catch (err) {

            logger.error(err);
            return { success: false, msg: err.message };
        }

    },
}

module.exports = blogService;