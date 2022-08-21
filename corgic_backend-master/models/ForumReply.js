const { Model } = require("objection");

const User = require("./User");

class ForumReply extends Model {

    static get tableName() {
        return "forum_replies";
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
                    from: "forum_replies.u_id",
                    to: "users.u_id"
                }
            },
        }
    }
}

module.exports = ForumReply;