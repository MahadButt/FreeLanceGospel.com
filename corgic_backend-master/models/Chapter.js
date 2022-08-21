const { Model } = require("objection");

const User = require("./User");

class Chapter extends Model {

    static get tableName() {
        return "chapter";
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
                 join: {
                    from: "chapter.u_id",
                    to: "users.u_id"
                }
            }
        }
    }
}

module.exports = Chapter;