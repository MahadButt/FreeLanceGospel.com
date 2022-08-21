const logger = require("../loaders/logger");
const Quiz = require('../models/Quiz');
const Notification = require("../models/Notification");
const QuizQuestions = require('../models/quiz_questions');
const QuizOptions = require('../models/quiz_options');
const QuizCategories = require("../models/quiz_categories");
const UserRankTitle = require("../models/UserRankTitle");
const RankTitle = require("../models/RankTitle");
const quizService = {

    submitResult: async function ({ totalQuestions, correctAnswers, quizId, categoryId, userId, totalCoins, quizLevel, levelUnlock }) {
        try {
            let titleId;
            let result = await Quiz.query().where("quiz_id", "=", quizId).where("u_id", "=", userId).where("quiz_level", "=", quizLevel).where("category_id", "=", categoryId)
            if (result.length == 0) {
                if (quizLevel == 5 && levelUnlock == 1) {
                    titleId = 1;
                    await UserRankTitle.query().insert({
                        u_id: userId,
                        cat_id: categoryId,
                        title_id: 1
                    })
                }else if (quizLevel == 10 && levelUnlock == 1) {
                    titleId = 2;
                    await UserRankTitle.query().patch({ title_id: 2 }).where("u_id", "=", userId).where("cat_id", "=", categoryId)
                } else if (quizLevel == 15 && levelUnlock == 1) {
                    titleId = 3;
                    await UserRankTitle.query().patch({ title_id: 3 }).where("u_id", "=", userId).where("cat_id", "=", categoryId)
                } else if (quizLevel == 20 && levelUnlock == 1) {
                    titleId = 4;
                    await UserRankTitle.query().patch({ title_id: 4 }).where("u_id", "=", userId).where("cat_id", "=", categoryId)
                } else if (quizLevel == 25 && levelUnlock == 1) {
                    titleId = 5;
                    await UserRankTitle.query().patch({ title_id: 5 }).where("u_id", "=", userId).where("cat_id", "=", categoryId)
                }
                await Quiz.query().insert({
                    quiz_id: quizId,
                    u_id: userId,
                    category_id: categoryId,
                    total_questions: totalQuestions,
                    correct_answers: correctAnswers,
                    quiz_level: quizLevel,
                    total_coins: totalCoins,
                    level_unlock: levelUnlock   //(0 => next level lock , 1=> next level unlock)
                })
            }
            else {
                if (totalCoins > result[0].total_coins) {
                    await Quiz.query().patch({ correct_answers: correctAnswers, total_questions: totalQuestions, level_unlock: levelUnlock, total_coins: totalCoins })
                        .where("quiz_id", "=", quizId).where("u_id", "=", userId).where("quiz_level", "=", quizLevel).where("category_id", "=", categoryId)
                    if (quizLevel == 10 && levelUnlock == 1) {
                        titleId = 2;
                        await UserRankTitle.query().patch({ title_id: 2 }).where("u_id", "=", userId).where("cat_id", "=", categoryId)
                    } else if (quizLevel == 15 && levelUnlock == 1) {
                        titleId = 3;
                        await UserRankTitle.query().patch({ title_id: 3 }).where("u_id", "=", userId).where("cat_id", "=", categoryId)
                    } else if (quizLevel == 20 && levelUnlock == 1) {
                        titleId = 4;
                        await UserRankTitle.query().patch({ title_id: 4 }).where("u_id", "=", userId).where("cat_id", "=", categoryId)
                    } else if (quizLevel == 25 && levelUnlock == 1) {
                        titleId = 5;
                        await UserRankTitle.query().patch({ title_id: 5 }).where("u_id", "=", userId).where("cat_id", "=", categoryId)
                    }
                }
            }
            if (titleId > 0) {
                let title = await RankTitle.query().where({ id: titleId });
                return { success: true, successResponse: "quiz submit successfully", title: title[0] }
            } else {
                return { success: true, successResponse: "quiz submit successfully" }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message }
        }

    },

    getQuizRanking: async function ({ quizId, limit }, u_id) {
        try {
            let result = [];
            if (u_id) {
                result = await Quiz.query()
                    .select(Quiz.knex().raw('SUM(total_coins) as totalCoins'))
                    .groupBy('u_id')
                    .where({ quiz_id: quizId, u_id: u_id });
            } else {
                result = await Quiz.query()
                    .select(Quiz.knex().raw('SUM(total_coins) as totalCoins'))
                    .eager("user")
                    .orderBy('totalCoins', 'desc')
                    .groupBy('u_id')
                    .where({ quiz_id: quizId }).limit(limit);
            }
            if (result.length > 0) {
                if (!u_id) {
                    for (let i = 0; i < result.length; i++) {
                        let titles = await UserRankTitle.query()
                            .select("id")
                            .eager("[category,title]")
                            .where({ u_id: result[i].user.u_id })
                        result[i].titles = titles;
                    }
                }
                return { success: true, successResponse: u_id ? result[0] : result }
            } else {
                return { success: false, msg: "Ranking not found" }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: "Ranking not found" }
        }
    },
    getUnlockLevels: async function ({ userId, categoryId }) {
        try {
            //console.log(id)
            let result = await Quiz.query()
                .select("u_id", "category_id", Quiz.knex().raw('quiz_level'), "level_unlock")
                .orderBy("quiz_level", "DESC")
                .where({ u_id: userId })
                .andWhere({ category_id: categoryId })
            if (result.length > 0) {
                return { success: true, successResponse: result[0] }
            } else {
                return { success: true, successResponse: { u_id: userId, category_id: categoryId, quiz_level: 1, level_unlock: 0 } }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: "levels not found" }
        }
    },
    sendChallenge: async function (data) {

        try {
            for (let i = 0; i < data.length; i++) {
                await Notification.query().insert(data[i]);
            }
            return { success: true, successResponse: "Challenge sent successfully" }
        } catch (err) {
            return { success: false, msg: err };
        }
    },
    uploadQuestion: (Quiz_Questions) => {
        try {
            Quiz_Questions.forEach(async (element, index) => {
                let question = {
                    question: element.question
                }
                let success = await QuizQuestions.query().insert(question);
                if (success) {
                    element.options.forEach(async obj => {
                        let option = {
                            question_id: success.id,
                            option: obj.opt,
                            is_correct: obj.isCorrect ? "true" : "false"
                        }
                        await QuizOptions.query().insert(option);
                    })
                }
            });
            return { success: true, successResponse: "Questions upload successfully" }
        } catch (err) {
            return { success: false, msg: err };
        }
    },
    getCategories: async function (tokenData) {
        try {

            let result = await QuizCategories.query().select("id", "name as category_name").where({ active: 1 });
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    let data = await QuizQuestions.query()
                        .where({ category_id: result[i].id });
                    result[i].no_of_questions = data.length;

                    let LevelsData = await Quiz.query()
                        .select("u_id", "category_id", Quiz.knex().raw('quiz_level'), "level_unlock")
                        .orderBy("quiz_level", "DESC")
                        .where({ u_id: tokenData.u_id })
                        .andWhere({ category_id: result[i].id });
                    if (LevelsData.length > 0) {
                        result[i].u_id = tokenData.u_id;
                        result[i].category_id = result[i].id;
                        result[i].quiz_level = LevelsData[0].quiz_level;
                        result[i].level_unlock = LevelsData[0].level_unlock;
                    } else {
                        result[i].u_id = tokenData.u_id;
                        result[i].category_id = result[i].id;
                        result[i].quiz_level = 1;
                        result[i].level_unlock = 0;
                    }
                }
                return { success: true, successResponse: result }
            } else {
                return { success: false, msg: "Categories not found" }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message }
        }
    },
    getQuestions: async function ({ categoryId }) {
        try {
            let result = await QuizQuestions.query()
                .select("question")
                .eager("options")
                .where({ category_id: categoryId })
            if (result.length > 0) {
                return { success: true, successResponse: result }
            } else {
                return { success: false, msg: "Questions not found" }
            }
        }
        catch (err) {
            logger.error(err)
            return { success: false, msg: err.message }
        }
    },
}
module.exports = quizService

