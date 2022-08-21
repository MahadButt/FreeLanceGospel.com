const { Model } = require("objection");

const User = require("./User");

class Books extends Model {

    static get tableName() {
        return "books";
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
                    from: "books.u_id",
                    to: "users.u_id"
                }
            }
        }
    }
}

module.exports = Books;