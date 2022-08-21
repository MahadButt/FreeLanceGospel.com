
const userRoles = {
    SYSOP: 1,
    ADMIN: 2,
    MODERATOR: 3,
    USER: 4
}

const userStatus = {
    PENDING: 0,
    ACTIVE: 1,
    DISABLED: 2
}

const friendReqStatus = {
    SENDER: 69,
    PENDING: 0,
    ACCEPTED: 1,
    DECLINED: 2
}

const blogHighlight = {
    NOT_HIGHLIGHT: 1,
    HIGHLIGHT: 2
}

const blogStatus = {
    DRAFT: 1,
    PENDING: 2,
    PUBLISHED: 3
}

const notificationRead = {
    UNREAD: 0,
    READ: 1
}

const notificationType = {
    INBOX_MSG: 1,
    FRIEND_REQUEST: 2,
    FRIEND_ACCEPT: 3,
    CHALLENGE_REQUEST: 4
}

const msgStatus = {
    UNREAD: 0,
    READ: 1
}

const siteStatus = {
    NORMAL: 1,
    MAINTENANCE: 2,
    LOCKDOWN: 3
}

const API_ROOT = "/";

module.exports = {
    userRoles,
    userStatus,
    blogHighlight,
    blogStatus,
    notificationRead,
    notificationType,
    friendReqStatus,
    msgStatus,
    siteStatus,
    API_ROOT
};
