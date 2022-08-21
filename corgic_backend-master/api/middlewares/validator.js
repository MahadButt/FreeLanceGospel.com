
const joi = require("joi");
const logger = require("../../loaders/logger");

const signUpSchema = joi.object().keys({
    first_name: joi.string().regex(/^[a-z A-Z]+$/).min(2).required()
        .error(() => "Invalid Firstname!"),
    last_name: joi.string().regex(/^[a-z A-Z]+$/).min(2).required()
        .error(() => "Invalid Lastname!"),
    denomination: joi.string().regex(/^[a-z A-Z]+$/).min(2).required()
        .error(() => "Invalid Denomination!"),
    church_title: joi.string().regex(/^[a-z A-Z]+$/).min(2).required()
        .error(() => "Invalid Church Title!"),
    email: joi.string().email().required()
        .error(() => "Invalid Email!"),
    password: joi.string().min(6).required()
        .error(() => "Invalid Password!"),
    re_password: joi.string().valid(joi.ref("password")).required().strict()
        .error(() => "Passwords Do Not Match!"),
});

const signInSchema = joi.object().keys({
    email: joi.string().email().required()
        .error(() => "Invalid Email!"),
    password: joi.string().min(6).required()
        .error(() => "Invalid Password!")
});

const signUpValidator = (req, res, next) => {

    const userFormData = req.body;

    const isValid = joi.validate(userFormData, signUpSchema);

    if (isValid.error) {

        logger.error(`Malicious SignUp Attempt => ip: ${ req.ipAddress } formData: ${ JSON.stringify(userFormData) }`, 
            isValid.error.details[0]);

        return res.json({
            msg: isValid.error.details[0].message
        });

    } else {
        return next();
    }
}

const signInValidator = (req, res, next) => {

    const userFormData = req.body;

    const isValid = joi.validate(userFormData, signInSchema);

    if (isValid.error) {

        logger.error(`Malicious SignIn Attempt => ip: ${ req.ipAddress } formData: ${ JSON.stringify(userFormData) }`, 
        isValid.error.details[0]);

        return res.json({
            msg: isValid.error.details[0].message
        });

    } else {
        return next();
    }
}

const sanitizeForm = (req, res, next) => {
    
    const body = req.body;

    for (let key in body) {
        body[key] = body[key].replace(/\s\s+/g, " "); // replace double spaces with single space
        body[key] = body[key].trim();
    }

    return next();
}

module.exports = {
    signUpValidator,
    signInValidator,
    sanitizeForm
}
