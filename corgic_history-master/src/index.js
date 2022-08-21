import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import './shared/theme/app.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-image-gallery/styles/scss/image-gallery.scss";
import "react-image-gallery/styles/css/image-gallery.css"

ReactDOM.render((
    <Router>
        <App />
    </Router>
), document.getElementById("root"));
serviceWorker.unregister();