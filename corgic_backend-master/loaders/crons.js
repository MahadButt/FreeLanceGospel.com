const cron = require("node-cron");
const moment = require("moment");
const userService = require("../services/UserService");
const cronsLoader = (app) => {
    cron.schedule('0 0 * * *', async () => {
        let randomWeekUser = await userService.getRandomUserForMemberShip();
        let checkuserforweek = await userService.checkUserForMembertype("week");
        if (checkuserforweek.user && checkuserforweek.user.length == 0) {
            let data = {
                u_id: randomWeekUser.user[0].u_id,
                member_type: "week"
            }
            await userService.saveUserAsMember(data);
        } else {
            var startdate = moment().format("YYYY-MM-DD");
            var enddate = moment(checkuserforweek.user[0].created_at).format("YYYY-MM-DD");
            var start = moment(startdate, "YYYY-MM-DD");
            var end = moment(enddate, "YYYY-MM-DD");
            //Difference in number of days
            let days = moment.duration(start.diff(end)).asDays();
            if (days >= 7) {
                if (checkuserforweek.user[0].u_id !== randomWeekUser.user[0].u_id) {
                    await userService.updateMember(checkuserforweek.user[0].id, randomWeekUser.user[0].u_id);
                }
            }
        }
        let randomMonthUser = await userService.getRandomUserForMemberShip();
        let checkuserformonth = await userService.checkUserForMembertype("month");
        if (checkuserformonth.user && checkuserformonth.user.length == 0) {
            let data = {
                u_id: randomMonthUser.user[0].u_id,
                member_type: "month"
            }
            await userService.saveUserAsMember(data);
        } else {
            var startdate = moment().format("YYYY-MM-DD");
            var enddate = moment(checkuserformonth.user[0].created_at).format("YYYY-MM-DD");
            var start = moment(startdate, "YYYY-MM-DD");
            var end = moment(enddate, "YYYY-MM-DD");
            //Difference in number of days
            let days = moment.duration(start.diff(end)).asDays();
            if (days >= 30) {
                if (checkuserformonth.user[0].u_id !== randomMonthUser.user[0].u_id) {
                    await userService.updateMember(checkuserformonth.user[0].id, randomMonthUser.user[0].u_id);
                }
            }
        }
    });
}
module.exports = cronsLoader;