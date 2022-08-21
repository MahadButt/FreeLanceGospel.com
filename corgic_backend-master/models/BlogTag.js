const { Model } = require("objection");

const Tag = require("./Tag");

class BlogTag extends Model {

    static get tableName() {
        return "blog_tags";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }

    static get relationMappings() {

        return {

            tag: {
                relation: Model.BelongsToOneRelation,
                modelClass: Tag,
                filter: builder => builder
                    .select("tags.tag_name"),
                join: {
                    from: "blog_tags.tag_id",
                    to: "tags.id"
                }
            }
        }
    }
}

module.exports = BlogTag;