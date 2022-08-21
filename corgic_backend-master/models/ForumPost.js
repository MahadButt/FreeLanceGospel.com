const { Model } = require("objection");

const User = require("./User");
const ForumReply = require("./ForumReply");
const ForumSection = require("./ForumSection");
const ForumTopic = require("./ForumTopic");

class ForumPost extends Model {

    static get tableName() {
        return "forum_post";
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
                    from: "forum_post.u_id",
                    to: "users.u_id"
                }
            },

            section: {
                relation: Model.BelongsToOneRelation,
                modelClass: ForumSection,
                join: {
                    from: "forum_post.section_id",
                    to: "forum_section.id"
                }
            },

            replies: {
                relation: Model.HasManyRelation,
                modelClass: ForumReply,
                join: {
                    from: "forum_post.id",
                    to: "forum_replies.post_id"
                }
            },

            topic: {
                relation: Model.BelongsToOneRelation,
                modelClass: ForumTopic,
                join: {
                    from: "forum_post.topic_id",
                    to: "forum_topic.id"
                }
            },
        }
    }
}

module.exports = ForumPost;