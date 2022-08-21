const quizControllers = require("../controllers/quiz");
const { Router } = require("express");
const { isAuth } = require("../middlewares/auth");
const router = Router();

const QuizRoutes=(app)=>{
    router.post("/submit-result",quizControllers.submitResult)
    router.post("/get-quiz-ranking/:quizId/:limit",quizControllers.getQuizRanking)
    router.get("/get-unlock-level/:userId/:categoryId",quizControllers.getUnlockLevels)
    router.post("/send-challenge",isAuth,quizControllers.sendChallenge)
    router.get("/upload_questions",quizControllers.uploadQuestions)
    router.get("/get_categories",isAuth,quizControllers.getCategories)
    router.get("/get_questions/:categoryId",quizControllers.getQuestions)
    app.use("/quiz", router);
}

module.exports = QuizRoutes;