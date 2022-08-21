const { Model } = require("objection");

const User = require("./User");
const ChatLine = require("./ChatLine");

class ChatChannel extends Model {

    static get tableName() {
        return "chat_channel";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }

    static get relationMappings() {

        return {

            messages: {
                relation: Model.HasManyRelation,
                modelClass: ChatLine,
                join: {
                    from: "chat_channel.id",
                    to: "chat_line.channel_id"
                }
            },

            user_one: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                filter: builder => builder.select("u_id", "first_name", "last_name", "avatar_url"),
                join: {
                    from: "chat_channel.u_1",
                    to: "users.u_id"
                }
            },

            user_two: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                filter: builder => builder.select("u_id", "first_name", "last_name", "avatar_url"),
                join: {
                    from: "chat_channel.u_2",
                    to: "users.u_id"
                }
            }
        }
    }
}

module.exports = ChatChannel;