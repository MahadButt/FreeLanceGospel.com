import React, { useState, useEffect, useCallback, createContext } from "react";
import { useHistory } from "react-router-dom";

export const AuthContext = createContext({
    isLoggedIn: false,
    admin: null,
    login: () => {},
    logout: () => {}
});

export const AuthContextProvider = (props) => {

    const [admin, setAdmin] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const history = useHistory();

    useEffect(() => {

        const admin = JSON.parse(localStorage.getItem("admin"));

        if (admin && admin.token) {

            login(admin, false);

        } else {

            localStorage.removeItem("admin");

            setAdmin(null);
            setIsLoggedIn(false);
        }

    }, []);

    const login = useCallback((admin, redirect) => {

        localStorage.setItem("admin", JSON.stringify(admin));
        setAdmin(admin);
        setIsLoggedIn(true);

        if (redirect) {
            history.push("/");
        }

    }, []);

    const logout = useCallback(() => {

        localStorage.removeItem("admin");

        setAdmin(null);
        setIsLoggedIn(false);

        history.push("/");

    }, []);
    
    return (
        <AuthContext.Provider 
            value={{
                isLoggedIn,
                admin,
                login,
                logout,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}