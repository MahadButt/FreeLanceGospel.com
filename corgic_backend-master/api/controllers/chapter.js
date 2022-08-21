
const chaptService = require("../../services/ChapService");

const createChapter = async (req, res, next) => {

    const body = JSON.parse(JSON.stringify(req.body));

    const result = await chaptService.createChapter(req.decode.u_id, body);
    return res.json(result);
}

const getChapters = async (req, res, next) => {

    const chapters = await chaptService.getChapters(req.decode.u_id);
    return res.json(chapters);
}
const updateChapter = async (req, res, next) => {

    const result = await chaptService.updateChapter(req.params.chap_id, req.body);
    return res.json(result);
}

module.exports = {
    createChapter,
    getChapters,
    updateChapter
}