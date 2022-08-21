import React, { createContext, useState } from "react";
import { Responsive } from "semantic-ui-react";

export const ThemeContext = createContext({
    theme: {},
});

export const ThemeContextProvider = (props) => {

    const [theme] = useState({
        isMobile: window.innerWidth <= Responsive.onlyMobile.maxWidth && window.innerWidth >= Responsive.onlyMobile.minWidth,
        isTab: window.innerWidth <= Responsive.onlyTablet.maxWidth && window.innerWidth >= Responsive.onlyTablet.minWidth,
        isComputer: window.innerWidth >= Responsive.onlyComputer.minWidth,
	});
    
    return (
        <ThemeContext.Provider 
            value={{ 
                theme,
            }}
        >
            {props.children}
        </ThemeContext.Provider>
    );
}