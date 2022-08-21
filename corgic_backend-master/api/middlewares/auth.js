
const User = require("../../models/User");
const logger = require("../../loaders/logger");

const doesUserExist = async (req, res, next) => {

    try {

        const email = req.body.email;
        
        const user = await User.query().findOne({ email });
    
        if (user) {
    
            logger.error(`Failed SignUp Attempt => ip: ${ req.ipAddress } email: ${ email }`);
            
            return res.json({
                signUpSuccess: false,
                msg: "User with provided email already exists!"
            });
        }
        
        return next(); // User Does not Exists, execute next middleware SIGN UP

    } catch (err) {
        
        logger.error(`Failed SignUp [INTERNAL SERVER ERROR] => ip: ${ req.ipAddress } email: ${ email }`);

        return res.json({
            signUpSuccess: false,
            msg: "Internal Server Error, Try Later!"
        });
    }

}

const doesUserNotExist = async (req, res, next) => {

    try {

        const email = req.body.email;

    	const user = await User.query().findOne({ email });

    	if (!user) {
        
        	logger.error(`Failed SignIn Attempt => ip: ${ req.ipAddress } email: ${ email }`);

        	return res.json({
            	loginSuccess: false,
            	msg: "User with provided email not found!"
        	});
        }
        
        return next(); // User Exists, execute next middleware SIGN IN
        
	} catch (err) {

        logger.error(`Failed SignIn [INTERNAL SERVER ERROR] => ip: ${ req.ipAddress } email: ${ email }`);

        return res.json({
            loginSuccess: false,
            msg: "Internal Server Error, Try Later!"
        });
	}
}

const isOwnProfile = (req, res, next) => {

    const u_id = req.params.u_id ? req.params.u_id : req.query.u_id;

    if (req.decode.u_id === parseInt(u_id)) {

        req.isOwnProfile = true;
        return next();
    
    } else {

        req.isOwnProfile = false;
        return next();
    }
}

const isAuth = (req, res, next) => {

    if (!req.isAuth) {
        logger.error(`[UNAUTHORIZED ACTION ${req.path}] ip: ${req.ipAddress}`);
        return res.json({ unauthorized: true });
    }

    return next();
}

const isAllowed = (req, res, next) => {

    const u_id = req.params.u_id ? req.params.u_id : req.query.u_id;

    if (req.decode.u_id === parseInt(u_id) || req.isAdmin) {
        return next();
    }

    logger.error(`[UNAUTHORIZED ACTION ${req.path}] ip: ${req.ipAddress}`);
    return res.json({ unauthorized: true });
}

const isAdmin = (req, res, next) => {

    if (!req.isAdmin) {
        logger.error(`[UNAUTHORIZED ACTION ${req.path}] ip: ${req.ipAddress}`);
        return res.json({ unauthorized: true });
    }

    return next();
}

module.exports = {
    doesUserExist,
    doesUserNotExist,
    isAuth,
    isAllowed,
    isAdmin,
    isOwnProfile
}