const { Model } = require("objection");

const ForumSection = require("./ForumSection");

const ForumPost = require("./ForumPost");

class ForumTopic extends Model {

    static get tableName() {
        return "forum_topic";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }

    static get relationMappings() {

        return {

            sections: {
                relation: Model.HasManyRelation,
                modelClass: ForumSection,
                join: {
                    from: "forum_topic.id",
                    to: "forum_section.topic_id"
                }
            },
            posts: {
                relation: Model.HasManyRelation,
                modelClass: ForumPost,
                join: {
                    from: "forum_topic.id",
                    to: "forum_post.topic_id"
                }
            },
        }
    }
}

module.exports = ForumTopic;