
const express = require("express");
const subdomain = require("express-subdomain");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const appRoot = require("app-root-path");

const loadRoutes = require("../api");
const logger = require("./logger");

const authService = require("../services/AuthService");

const { userRoles } = require("../utils/consts");

const expressLoader = (app) => {

    app.use(cors());

    app.use(express.static(path.join(appRoot.path, "public")));
    //app.use(subdomain("manage", express.static(path.join(`${appRoot.path}/public/manage`))));
	app.use(subdomain("manage", express.static(path.join(appRoot.path, "public", "manage"))));
    app.use(express.static(path.join(appRoot.path, "public", "users")));

    // ATTACH IP ADDRESS TO EACH REQUEST
    app.use((req, res, next) => {
        req.ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        return next();
    });

    // EXTRACT TOKEN
    app.use((req, res, next) => {

        const token = req.headers["authorization"] ? req.header("authorization").split(" ")[1] : null;

        if (token) {
            req.token = token;
        }

        return next();
    });

    // DECODE TOKEN
    app.use((req, res, next) => {

        if (req.token) {

            const decode = authService.decodeAuthToken(req.token);

            if (!decode.tokenValid) {

                logger.error(`[INVALID JWT ${req.path}] ip: ${ req.ipAddress }`);
                logger.error(decode.err);
                
                req.isAuth = false;
                return next();

            } else {

                req.isAuth = true;
                req.decode = decode.data;
    
                return next();
            }
        }

        return next();
    });

    // Check if is admin
    app.use((req, res, next) => {
        
        const roleId = req.decode ? req.decode.role_id : null;

        if (req.isAuth && (roleId === userRoles.SYSOP || roleId === userRoles.ADMIN)) {
            req.isAdmin = true;
        }

        return next();
    });

    app.use(morgan("combined", { stream: logger.stream }));
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(cookieParser(process.env.SCOOK_SECRET));
    app.enable("trust proxy"); //TO BE ENABLED FOR NGINX

    // LOAD API
    app.use(process.env.API_PREFIX, loadRoutes());
    
    app.get("*", (req, res, next) => {
        console.log(`subdomain... ${req.subdomains}`)
        if (req.subdomains.length > 0 && req.subdomains[0] === "manage") {
            return res.status(200).sendFile(path.join(appRoot.path + "/public/manage/index.html"));
        } else {
            return res.status(200).sendFile(path.join(appRoot.path + "/public/users/index.html"));
        }
    });
}

module.exports = expressLoader;
