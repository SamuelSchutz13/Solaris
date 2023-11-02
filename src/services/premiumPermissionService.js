const fs = require('fs');
const { JSON_DIR, COINS_COST } = require('../config');
const { solankService } = require("../services/solankService");

const processUserPremium = async (userJid, remoteJid, type, baileysMessage, sendReply) => {
    let isUserPremium = false;
    let isGroupPremium = false;

    const userJsonPath = `${JSON_DIR}/user/${userJid.split('@')[0]}.json`;
    const groupJsonPath = `${JSON_DIR}/group/${remoteJid}.json`;

    if (fs.existsSync(userJsonPath)) {
        const userData = JSON.parse(fs.readFileSync(userJsonPath));
        if (userData.premium === true) {
            isUserPremium = true;
        } else if (userData.premium === false && userData.coins && userData.coins >= COINS_COST) {
            if (type === "premium") {
                userData.coins -= COINS_COST;
                fs.writeFileSync(userJsonPath, JSON.stringify(userData, null, 2));
                isUserPremium = true;
                const solankMessage = solankService(userData, COINS_COST, baileysMessage);
                await sendReply("Abrindo Solank... O seu banco Robótico");
                setTimeout(async () => {
                    await sendReply(solankMessage);
                }, 1000);
            }
        }
    }

    if (fs.existsSync(groupJsonPath)) {
        const groupData = JSON.parse(fs.readFileSync(groupJsonPath));
        // Check if group is premium
        if (groupData.premium === true) {
            isGroupPremium = true;
        }
    }

    return { isUserPremium, isGroupPremium };
};

module.exports = { processUserPremium };
