export const notificationRead = {
    UNREAD: 0,
    READ: 1
}

export const notificationType = {
    INBOX_MSG: 1,
    FRIEND_REQUEST: 2,
    FRIEND_ACCEPT: 3,
    COMMUNITY_REQUEST: 4,
    COMMUNITY_ACCEPT: 5,
    COMMUNITY_USER_ACCEPT: 6,
    COMMUNITY_USER_DECLINE: 7,
    FRIEND_USER_ACCEPT: 8,
    FRIEND_USER_DECLINE: 9,
    DELETE: 10,
}

export const friendReqStatus = {
    SENDER: 69,
    PENDING: 0,
    ACCEPTED: 1,
    DECLINED: 2
}

export const maritalStatus = {
    UNMARRIED: 1,
    MARRIED: 2
}

export const userRoles = {
    SYSOP: 1,
    ADMIN: 2,
    MODERATOR: 3,
    USER: 4
}

const dev = "http://localhost:5000/";
const prod = "https://thegospelpage.com/";
export const LIBRARY_URL = "http://digitallibrary.usc.edu/digital"

export const API_ROOT = prod;
