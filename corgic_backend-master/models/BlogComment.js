const { Model } = require("objection");

const User = require("./User");

class BlogComment extends Model {

    static get tableName() {
        return "blog_comments";
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
                    .select("users.first_name", "users.last_name", "users.u_id", "users.avatar_url"),
                join: {
                    from: "blog_comments.u_id",
                    to: "users.u_id"
                }
            },
        }
    }
}

module.exports = BlogComment;