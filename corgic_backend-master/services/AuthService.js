
const logger = require("../loaders/logger");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const User = require("../models/User");
const { userRoles, userStatus } = require("../utils/consts");

const authService = {

    salt: 12,

    generateUniqueId: async function (model, field) {

        const unique_id = crypto.randomBytes(3).toString("hex");

        const idExists = await model.query().select(field).findOne({ [field]: unique_id });

        if (idExists) {
            this.generateUniqueId();
        }

        return unique_id;
    },

    generateAuthToken: function (payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRY_TIME });
    },
    
    decodeAuthToken: function(token) {

        try {

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            
            return { tokenValid: true, data: decode };

        } catch (err) {
            return { err: err, tokenValid: false };
        }
    },

    SignInAdmin: async function(userData) {

        try {
            
            const admin = await User
                .query()
                .select("u_id", "email", "password", "status")
                .findOne({ email: userData.email, role_id: userRoles.ADMIN });

            if (!admin) {
                return {
                    loginSuccess: false,
                    msg: "User with provided email not found!"
                }; 
            }

            const matchPass = await bcrypt.compare(userData.password, admin.password);
            
            if (!matchPass) {
 
                return {
                    loginSuccess: false,
                    msg: "Password do not match!"
                };
            }

            if (admin.status !== userStatus.ACTIVE) {

                return {
                    loginSuccess: false,
                    msg: "Your account is not active!"
                };
            }
            
            const payload = {
                u_id: admin.u_id,
                role_id: userRoles.ADMIN,
                email: admin.email
            };
            
            const token = this.generateAuthToken(payload);

            await User
                .query()
                .patch({ last_login: moment().format("YYYY-MM-DD HH:mm:ss") })
                .where({ u_id: admin.u_id });

            return {
                loginSuccess: true,
                u_id: admin.u_id,
                email: admin.email,
                token: token
            };

        } catch (err) {

            logger.error("Error from SignIn Service, Internal Server Error: ");
            logger.error(err);

            return {
                loginSuccess: false,
                msg: "Internal Server Error while trying to login"
            }
        }
    },

    SignIn: async function(userData) {

        try {
            
            const user = await User
                .query()
                .select(
                    "u_id", 
                    "role_id",
                    "first_name", 
                    "last_name", 
                    "church_title", 
                    "avatar_url", 
                    "email", 
                    "password", 
                    "status"
                ).findOne({ email: userData.email });

            const matchPass = await bcrypt.compare(userData.password, user.password);
            
            if (!matchPass) {
 
                return {
                    loginSuccess: false,
                    msg: "Password do not match!"
                };
            }

            if (user.status !== userStatus.ACTIVE) {

                return {
                    loginSuccess: false,
                    msg: "Your account is not active!"
                };
            }
            
            const payload = {
                u_id: user.u_id,
                role_id: user.role_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            };
            
            const token = this.generateAuthToken(payload);

            await User
                .query()
                .patch({ last_login: moment().format("YYYY-MM-DD HH:mm:ss") })
                .where({ u_id: user.u_id });

            return {
                loginSuccess: true,
                u_id: user.u_id,
                role_id: user.role_id,
                first_name: user.first_name,
                last_name: user.last_name,
                church_title: user.church_title,
                email: user.email,
                avatar_url: user.avatar_url,
                token: token
            };

        } catch (err) {

            logger.error("Error from SignIn Service, Internal Server Error: ");
            logger.error(err);

            return {
                loginSuccess: false,
                msg: "Internal Server Error while trying to login"
            }
        }
    },

    SignUp: async function(userData) {

        try {
            
            const hash = await bcrypt.hash(userData.password, this.salt);
            
            const dbData = {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                denomination: userData.denomination,
                church_title: userData.church_title,
                password: hash,
                avatar_url: "uploads/images/user.svg",
                role_id: userRoles.USER,
                status: userStatus.ACTIVE
            };

            const user = await User.query().insert(dbData);

            return {
                signUpSuccess: true,
                u_id: user.u_id,
                email: user.email
            };
            
        } catch (err) {

            logger.error("Error from SignUp Service, Failed SignUp, Internal Server Error");
            logger.error(err);

            return {
                signUpSuccess: false,
                msg: "Internal Server Error while trying to signup"
            };
        }
    },

    activateAccount: async function(token) {
        
        const decode = this.decodeAuthToken(token);

        if (decode.tokenValid) {

            try {

                await User
                    .query()
                    .patch({ status: userStatus.ACTIVE })
                    .where({ email: decode.data.email });

                return { userActivated: true };

            } catch (err) {

                logger.error(err);
                return { userActivated: false };
            }

        }
        
        return { userActivated: false };
    },

    changeUserPassword: async function(id, password) {

        try {
            
            const hash = await bcrypt.hash(password, this.salt);
    
            await User.query().patch({ password: hash }).where({ u_id: id });
    
            return { passChange: true };

        } catch (err) {

            logger.error("Changing password failed, Internal Server Error");
            logger.error(err);

            return { passChange: false };
        }
    },

    createAdmin: async function(data) {
        
        try {

            const user = await User.query().findOne({ email: data.email });

            if (!user) {
                return {
                    success: false,
                    msg: "User not found"
                };
            }

            await User.query().patch({ role_id: userRoles.ADMIN });

            return {
                success: true,
                msg: `${data.email} is now an admin!`
            };
            
        } catch (err) {
            logger.error(err);
        }
    },
    getUserWithEmail: async function (email) {

        try {

            const user = await User
                .query()
                .select(
                    "u_id",
                    "role_id",
                    "first_name",
                    "last_name",
                    "church_title",
                    "avatar_url",
                    "email",
                    "password",
                    "status"
                ).findOne({ email: email });
            if (!user) {
                return {
                    success: false,
                    msg: "User not exist"
                }
            } else {
                const token = crypto.randomBytes(20).toString("hex");
                let passwordExp = Date.now() + 3600000; //1 hour
                let response = await User.query().update({ resetPassToken: token, resetPassExpires: passwordExp }).where({ u_id: user.u_id });
                if (response && response > 0) {
                    return {
                        success: true,
                        token:token,
                        u_id: user.u_id,
                        role_id: user.role_id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        church_title: user.church_title,
                        email: user.email,
                    };
                } else {
                    return {
                        success: false,
                        msg: "Internal Server Error while trying to recover password"
                    }
                }
            }

        } catch (err) {

            logger.error("Error from recover Password Service, Internal Server Error: ");
            logger.error(err);

            return {
                success: false,
                msg: "Internal Server Error while trying to recover password"
            }
        }
    },
    checkUserToken: async function (data) {
        try {
            let userData = await User.query()
                .where("resetPassToken", "=", data.token)
                .where("resetPassExpires", ">=", Date.now());

            if (!userData.length) {
                return {
                    success: false,
                    msg: "password token is invalid or has been expired"
                }
            } else {
                const hashed = await bcrypt.hash((data.password).toString(), this.salt);
                let updateResponse = await User.query().update({ password: hashed, resetPassToken: null, resetPassExpires: null }).where({ u_id: userData[0].u_id });
                if (updateResponse && updateResponse > 0) {
                    return {
                        success: true,
                        msg: "password has been updated"
                    }
                } else {
                    return {
                        success: false,
                        msg: "Internal Server Error while trying to reset password"
                    }
                }
            }
        } catch (err) {
            return {
                success: false,
                msg: err.message
            }
        }
    }
}

module.exports = authService;
