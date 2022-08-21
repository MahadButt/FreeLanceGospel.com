import React, { useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { notificationType, friendReqStatus } from "../../utils/consts";
import axios from "../../utils/axiosInstance";

import NotificationPanel from "./NotificationPanel";

const NotificationCenter = (props) => {

    const auth = useContext(AuthContext);

    const [reqButtonLoading, setReqButtonLoading] = useState(false);

    const markAsRead = async (notification_id) => {

        await axios.patch(
            `/user/mark-notification/${notification_id}`, 
            { status: 1 }, 
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );
        
        auth.updateNotificationType(notification_id, notificationType.DELETE);
    }

    const respondFriendReq = async (notification_id, response, friend_id) => {
        
        setReqButtonLoading(true);

        try {

            await axios.patch("/user/respond-friend-req", { response, friend_id }, { headers: { Authorization: `Bearer ${auth.user.token}` } });

            if (response === friendReqStatus.ACCEPTED) {
                auth.updateNotificationType(notification_id, notificationType.FRIEND_USER_ACCEPT);
            } else if (response === friendReqStatus.DECLINED) {
                auth.updateNotificationType(notification_id, notificationType.FRIEND_USER_DECLINE);
            }

            setReqButtonLoading(false);

        } catch (err) {
            console.log(err);
            setReqButtonLoading(false);
        }
    }

    return (
        <NotificationPanel
            notifications={auth.notifications}
            reqButtonLoading={reqButtonLoading}
            respondFriendReq={respondFriendReq}
            markAsRead={markAsRead}
        />
    );
}

export default NotificationCenter;