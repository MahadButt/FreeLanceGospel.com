const logger = require("../loaders/logger");
const { transaction } = require("objection");
const { friendReqStatus, notificationType, notificationRead } = require("../utils/consts");

const notificationService = require("./NotificationService");

const User = require("../models/User");
const UserFriends = require("../models/UserFriends");

const friendService = {

    sendFriendReq: async function (data, token) {

        try {

            const result = await transaction(UserFriends.knex(), async (trx) => {
                
                await Promise.all([
                    UserFriends.query(trx).insert({
                        u_id: token.u_id,
                        friend_id: data.friend_id,
                        status: friendReqStatus.SENDER
                    }),

                    UserFriends.query(trx).insert({
                        u_id: data.friend_id,
                        friend_id: token.u_id
                    })
                ]);
                
                notificationService.pushNotification(
                    data.friend_id, 
                    notificationType.FRIEND_REQUEST, 
                    `${token.first_name} ${token.last_name} sent you a friend request`,
                    `/profile/?u_id=${data.friend_id}&target=friend&sub_target=pending`
                );

                return true;
            });

            return { addFriend: result };

        } catch (err) {

            logger.error(err);
            return { addFriend: false };
        }

    },

    respondFriendReq: async function (data, token) {

        try {

            const result = await transaction(UserFriends.knex(), async (trx) => {

                if (data.response === friendReqStatus.ACCEPTED) {

                    await Promise.all([
                        
                        UserFriends.query(trx)
                            .patch({ status: friendReqStatus.ACCEPTED })
                            .where({
                                u_id: token.u_id,
                                friend_id: data.friend_id
                            }),

                        UserFriends.query(trx)
                           .patch({ status: friendReqStatus.ACCEPTED })
                           .where({
                               u_id: data.friend_id,
                               friend_id: token.u_id
                           })
                    ]);

                    notificationService.pushNotification(
                        data.friend_id, 
                        notificationType.FRIEND_ACCEPT, 
                        `${token.first_name} ${token.last_name} accepted your friend request`,
                        `/profile/?u_id=${token.u_id}`
                    );

                    return { addFriend: true };

                } else if (data.response === friendReqStatus.DECLINED) {

                    await Promise.all([

                        UserFriends.query(trx)
                            .delete()
                            .where({
                                u_id: u_id,
                                friend_id: data.friend_id
                            }),
    
                        UserFriends.query(trx)
                            .delete()
                            .where({
                                u_id: data.friend_id,
                                friend_id: u_id
                            }),
    
                        notificationService.markNotification(null, notificationRead.READ, u_id, notificationType.FRIEND_REQUEST, data.friend_id)
                    ]);

                    return { declineFriend: true };
                }

            });

            return result;

        } catch (err) {
            logger.error(err);
            return { addFriend: false };
        }
    },

    removeFriend: async function (data, u_id) {

        try {

            const result = await transaction(UserFriends.knex(), async (trx) => {

                await UserFriends.query(trx)
                    .delete()
                    .where({
                        u_id: u_id,
                        friend_id: data.friend_id
                    });

                await UserFriends.query(trx)
                    .delete()
                    .where({
                        u_id: data.friend_id,
                        friend_id: u_id
                    });
                
                return true;

            });

            return { removeFriend: result };

        } catch (err) {
            
            logger.error(err);
            return { removeFriend: false };
        }
    },

    checkIfFriend: async function (u_id, friend_id) {
        
        try {

            const result = await UserFriends.query()
                .findOne({
                    u_id: u_id,
                    friend_id: parseInt(friend_id)
                });

            if (result) {
                return { isFriend: true, friendStatus: result.status };
            } else {
                return { isFriend: false };
            }
            
        } catch (err) {
            logger.error(err);
            return { isFriend: false };
        }
    },

    getFriends: async function (u_id, status) {

        const whereFilter = { u_id };

        if (status) {
            whereFilter.status = status;
        }

        const friends = await UserFriends.query().eager("friend").where(whereFilter);
        return friends;
    },

    searchFriends: async function (u_id, status, searchKey) {

        if (searchKey) {

            const friends = await UserFriends
                .query()
                .select("users.u_id", "users.first_name", "users.last_name", "users.avatar_url")
                .innerJoin("users", "user_friends.friend_id", "users.u_id")
                .where({ "user_friends.u_id": u_id, "user_friends.status": status })
                .andWhere(function() {
                    this.where("users.first_name", "like", `%${searchKey}%`)
                    .orWhere("users.last_name", "like", `%${searchKey}%`)
                });
    
            return friends;
        }

        return [];
    },

    generateConnection: async function (u_id, friend_id) {
        
        try {

            let f1 = await UserFriends.query().select("friend_id").where({ u_id });
            let f2 = await UserFriends.query().select("friend_id").where({ u_id: friend_id });

            f1 = f1.map(friend => friend.friend_id);
            f2 = f2.map(friend => friend.friend_id);

            const common_friends = f1.filter(value => f2.includes(value));

            const users = await User
                .query()
                .select("u_id", "first_name", "last_name", "avatar_url").whereIn("u_id", common_friends);

            return users;

        } catch (err) {
            logger.error(err);
        }
    }
}

module.exports = friendService;