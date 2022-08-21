
const authControllers = require("../controllers/auth");
const { signInValidator, signUpValidator, sanitizeForm } = require("../middlewares/validator");
const { doesUserExist, doesUserNotExist, isAuth } = require("../middlewares/auth");
const { Router } = require("express");

const router = Router();

const authRoutes = (app) => {

    router.post("/verify-token", isAuth, authControllers.verifyAuthToken);

    router.post("/sign-up", sanitizeForm, signUpValidator, doesUserExist, authControllers.postSignUp);

    router.get("/activate-user", authControllers.activateAccount);

    router.post("/sign-in", sanitizeForm, signInValidator, doesUserNotExist, authControllers.postSignIn);

    router.post("/change-password", isAuth, authControllers.changeUserPassword);

    router.post("/recover-password", authControllers.recoverUserPassword);

    router.post("/reset-password/:token", authControllers.resetPassword);

    app.use("/auth", router);
}

module.exports = authRoutes;