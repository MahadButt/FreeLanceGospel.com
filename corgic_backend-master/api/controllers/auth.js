
const authService = require("../../services/AuthService");
const logger = require("../../loaders/logger");
const nodemailer = require("nodemailer");
var dotenv = require("dotenv")
dotenv.config()
const transporter = nodemailer.createTransport({
    // host: "smtp.mail.yahoo.com",
    // port: 465,
    service: 'gmail',
    // secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});
const Email_FROM = `"GOSPEL" <${process.env.EMAIL}>`;
const postSignIn = async (req, res, next) => {

    try {

        const signInData = req.body;
        const data = await authService.SignIn(signInData);

        if (!data.loginSuccess) {

            // INTERNAL SERVER ERROR
            logger.error(`Failed SignIn, ${data.msg} => ip: ${ req.ipAddress } email: ${ signInData.email }`);   

            return res.json({
                loginSuccess: false,
                msg: data.msg
            });
        }

        logger.info(`New SignIn => id: ${ data.u_id }, email: ${ data.email }`);

        return res.json(data);

    } catch (err) {
        
        logger.error(`Failed SignIn, Internal Server Error => ip: ${ req.ipAddress } email: ${ signInData.email }`);
    }
}

const postSignUp = async (req, res, next) => {

    try {

        const signUpData = req.body;
        delete signUpData.re_password;
        
        const data = await authService.SignUp(signUpData);

        if (data.signUpSuccess) {
            
            logger.info(`New SignUp => ip: ${ req.ipAddress } email: ${ signUpData.email }`);

            return res.json({
                signUpSuccess: true,
                msg: "Successfully Signed Up!"
            });

        } else {

            logger.error(`Failed SignUp => ip: ${ req.ipAddress } email: ${ signUpData.email } msg: ${ data.msg }`);   

            return res.json({
                signUpSuccess: false,
                msg: data.msg
            });
        }

    } catch (err) {

        logger.error(`Failed SignUp, Internal Server Error => ip: ${ req.ipAddress } email: ${ signUpData.email }`);

        return res.json({
            signUpSuccess: false,
            msg: "We're having some troubles, please try again later!"
        });
    }
}

const activateAccount = async (req, res, next) => {

    const result = await authService.activateAccount(req.query.token);
    return res.json(result);
}

const verifyAuthToken = (req, res, next) => {
    return res.json({ tokenValid: req.isAuth });
}

const changeUserPassword = async (req, res, next) => {

    const id = req.decode.u_id;
    const password = req.body.password;

    const passChange = await authService.changeUserPassword(id, password);

    return res.json(passChange);
}

const recoverUserPassword = async (req, res, next) => {
    try {
        console.log("alfjaslkjf", process.env.USER)
        const email_address = req.body.email;
        const data = await authService.getUserWithEmail(email_address);
        if (!data.success) {

            // INTERNAL SERVER ERROR
            logger.error(`Failed recover Password, ${data.msg} => ip: ${req.ipAddress} email: ${email_address}`);

            return res.json({
                success: false,
                msg: data.msg
            });
        } else {
            transporter.sendMail({
                from: Email_FROM,
                to: email_address,
                subject: 'Forgot Password',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset-pass/?token=' + data.token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            }, function (err, _info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('email send successfully')
                }
            });
            logger.info(`New Recover Password => id: ${data.u_id}, email: ${data.email}`);

            return res.json(data);
        }
    } catch (err) {

        logger.error(`Failed recover Password, Internal Server Error => ip: ${req.ipAddress} email: ${req.body.email}`);
    }
    //  TODO:
}
const resetPassword = async (req, res, next) => {
    try {
        let token = req.params.token;
        req.body.token = token;
        const data = await authService.checkUserToken(req.body);
        if (!data.success) {

            // INTERNAL SERVER ERROR
            logger.error(`Failed reset Password, ${data.msg} => ip: ${req.ipAddress}`);
            return res.json({
                success: false,
                msg: data.msg
            });
        } else {
            logger.info(`Reset Password`);

            return res.json(data);
        }
    } catch (err) {

        logger.error(`Failed reset Password, Internal Server Error => ip: ${req.ipAddress}`);
    }
}


module.exports = {
    postSignIn,
    postSignUp,
    activateAccount,
    verifyAuthToken,
    changeUserPassword,
    recoverUserPassword,
    resetPassword
}