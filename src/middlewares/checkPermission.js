const { JSON_DIR, DEV_ID, COINS_COST } = require('../config');
const { solankService } = require("../services/solankService");
const fs = require('fs');

exports.checkPermission = async ({ 
    type, 
    bot, 
    userJid, 
    remoteJid,
    sendReply,
    baileysMessage,
}) => {
    const { participants, owner } = await bot.groupMetadata(remoteJid);
    const participant = participants.find(
        (participant) => participant.id === userJid
    );

    if (participant !== undefined && (type === "member" || type === "menus")) {
        return true;
    }

    const isDev = participant.id === `${DEV_ID}`;
    const isOwner = participant.id === owner || participant.admin === "superadmin";
    const isAdmin = participant.admin === "admin";

    let isUserPremium = false; 
    let isGroupPremium = false;
    const debitCoins = parseInt(`${COINS_COST}`);
    const userJsonPath = `${JSON_DIR}/user/${userJid.split('@')[0]}.json`;
    const groupJsonPath = `${JSON_DIR}/group/${remoteJid}.json`;

    if (fs.existsSync(userJsonPath)) {
        const userData = JSON.parse(fs.readFileSync(userJsonPath));
        if (userData.premium && userData.premium === true) {
            isUserPremium = true;
        } else if (userData.premium === false && userData.coins && userData.coins >= `${COINS_COST}`) {
            userData.coins -= debitCoins; 
            fs.writeFileSync(userJsonPath, JSON.stringify(userData, null, 2));
            isUserPremium = true;

            const solankMessage = solankService(userData, debitCoins, baileysMessage);
            await sendReply("Abrindo Solank... O seu banco Robótico");
            setTimeout(async () => {
                await sendReply(solankMessage);
            }, 1000);
        }
    }

    if (fs.existsSync(groupJsonPath)) {
        const groupData = JSON.parse(fs.readFileSync(groupJsonPath));
        if (groupData.premium && groupData.premium === true) {
            isGroupPremium = true;
        }
    }

    if (type === "dev") {
        return isDev;
    }

    if (type === "owner") {
        return isOwner;
    }

    if (type === "admin") {
        return isOwner || isAdmin;
    }

    if (type === "premium") {
        return isGroupPremium || isUserPremium;
    }

    return false;
};
