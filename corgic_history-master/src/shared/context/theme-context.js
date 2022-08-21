import { createContext } from "react";

export const ThemeContext = createContext({
    theme: {},
    notificationModalOpen: false,
    inviteModalOpen: false,
    inviteModalControl: () => {},
    notificationModalControl: () => {}
});
