import { createContext } from "react";

export const AuthContext = createContext({
    filterUrl: "",
    setFilterUrl: () => {},
    authModalOpen: false,
    authModalControl: () => {},
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    login: () => {},
    logout: () => {},
    notifications: [],
    updateNotificationType: () => {},
});