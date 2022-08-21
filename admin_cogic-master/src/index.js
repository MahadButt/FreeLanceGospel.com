import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthContextProvider } from "./shared/context/auth-context";
import { ThemeContextProvider } from "./shared/context/theme-context";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "./index.scss";

ReactDOM.render((
    <Router>
        <AuthContextProvider>
            <ThemeContextProvider>
                <App />
            </ThemeContextProvider>
        </AuthContextProvider>
    </Router>
), document.getElementById("root"));

serviceWorker.unregister();
