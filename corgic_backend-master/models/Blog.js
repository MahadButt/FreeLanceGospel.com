const { Model } = require("objection");

const User = require("./User");
const BlogComment = require("./BlogComment");
const BlogCat = require("./BlogCat");
const BlogSubCat = require("./BlogSubCat");
const BlogTag = require("./BlogTag");
const Chapter = require("./Chapter");

class Blog extends Model {

    static get tableName() {
        return "blog";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }

    static get relationMappings() {

        return {

            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                filter: builder => builder
                    .select("users.first_name", "users.last_name", "users.u_id", "users.avatar_url", "users.church_title"),
                join: {
                    from: "blog.u_id",
                    to: "users.u_id"
                }
            },

            category: {
                relation: Model.BelongsToOneRelation,
                modelClass: BlogCat,
                filter: builder => builder
                    .select("blog_cat.id", "blog_cat.category_name"),
                join: {
                    from: "blog.cat_id",
                    to: "blog_cat.id"
                }
            },

            sub_category: {
                relation: Model.BelongsToOneRelation,
                modelClass: BlogSubCat,
                filter: builder => builder
                    .select("blog_subcat.id", "blog_subcat.subcat_name"),
                join: {
                    from: "blog.subcat_id",
                    to: "blog_subcat.id"
                }
            },

            tags: {
                relation: Model.HasManyRelation,
                modelClass: BlogTag,
                filter: builder => builder
                    .select("blog_tags.id"),
                join: {
                    from: "blog.id",
                    to: "blog_tags.blog_id"
                }
            },

            comments: {
                relation: Model.HasManyRelation,
                modelClass: BlogComment,
                join: {
                    from: "blog.id",
                    to: "blog_comments.blog_id"
                }
            },
            chapter: {
                relation: Model.BelongsToOneRelation,
                modelClass: Chapter,
                join: {
                    from: "blog.chapter_id",
                    to: "chapter.id"
                }
            },
        }
    }
}

module.exports = Blog;