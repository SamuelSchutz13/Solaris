const { JSON_DIR, BOT_NUMBER } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { solankService } = require("../../services/solankService");
const { getRandomPrefix } = require("../../services/prefixService");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

module.exports = {
    name: "check",
    description: "Checa se o usuário não é um robô",
    commands: ["check", "checar"],
    usage: `${getRandomPrefix()}check`,
    handle: async ({
        isReply,
        replyJid,
        userJid,
        baileysMessage,
        sendWaitReply,
        sendReply,
        sendSuccessReact,
    }) => {
        const memberToJid = isReply ? replyJid : toUserJid(userJid);
        const memberToNumber = onlyNumbers(memberToJid);

        if (memberToNumber.length < 7 || memberToNumber.length > 15) {
            throw new InvalidParameterError("Número inválido!");
        }

        const botJid = toUserJid(BOT_NUMBER);

        if (memberToJid === botJid) {
            throw new DangerError("Eu não posso fazer o Check!");
        }

        const userJsonPath = path.join(`${JSON_DIR}/user/${memberToNumber}.json`);
        let userData = {};
        let debitCoins =  Math.floor(Math.random() * 5) + 1;

        if (fs.existsSync(userJsonPath)) {
            const jsonData = fs.readFileSync(userJsonPath, "utf-8");
            userData = JSON.parse(jsonData);
            
            const lastCheckDate = userData.lastCheckDate;
            const today = moment().format("YYYY-MM-DD");

            if (lastCheckDate === today) {
                throw new DangerError("Você já fez o check hoje!");
            }

            userData.lastCheckDate = today;

            
            userData.coins = (userData.coins || 0) + debitCoins;
        } else {
            userData = {
                memberToJid: memberToJid,
                memberToNumber: memberToNumber,
                premiumExpirationDate: null,
                premium: false,
                coins: debitCoins,
                lastCheckDate: moment().format("YYYY-MM-DD"), 
            };
        }

        fs.writeFileSync(userJsonPath, JSON.stringify(userData, null, 2));
        
        await sendWaitReply();
        await sendSuccessReact();
        await sendReply(solankService(userData, debitCoins, baileysMessage));
    },
};
