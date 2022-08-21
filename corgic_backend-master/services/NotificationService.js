const logger = require("../loaders/logger");
const Notification = require("../models/Notification");
const { notificationRead } = require("../utils/consts");

const notificationService = {

    pushNotification: async function(u_id, notification_type, body, url) {

        try {
         
            return Notification.query().insert({ u_id, notification_type, body, url });

        } catch (err) {

            logger.error(err);
            return false;
        }
    },

    removeNotification: async function(notification_id) {

        try {
            
            return Notification.query().delete().where({ id: notification_id });

        } catch (err) {
            logger.error(err);
        }
    },

    getNotifications: async function(u_id) {

        try {

            const notifications = await Notification
                .query()
                .where({ u_id, is_read: notificationRead.UNREAD })
                .orderBy("created_at", "desc");

            return notifications;

        } catch (err) {
            logger.error(err);
        }
    },

    markNotification: async function(notification_id) {

        try {
            
            return Notification.query().patch({ is_read: notificationRead.READ }).where({ id: notification_id });

        } catch (err) {
            logger.error(err);
        }
    }
}

module.exports = notificationService;