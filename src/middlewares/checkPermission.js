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
    if (type === "member" || type === "menus") {
        return true;
    }

    const { participants, owner } = await bot.groupMetadata(remoteJid);

    const participant = participants.find(
        (participant) => participant.id === userJid
    );

    if (participants.length < 3) {
        return false;
    }

    if(!participant) {
        return false;
    }

    const isDev = participant.id === `${DEV_ID}`;
    const isOwner = participant.id === owner || participant.admin === "superadmin";
    const isAdmin = participant.admin === "admin";

    let isPremium = false; 
    const debitCoins = parseInt(`${COINS_COST}`);
    const userJsonPath = `${JSON_DIR}/user/${userJid.split('@')[0]}.json`;

    if (fs.existsSync(userJsonPath)) {
        const userData = JSON.parse(fs.readFileSync(userJsonPath));
        if (userData.premium && userData.premium === true) {
            isPremium = true;
        } else if (userData.premium === false && userData.coins && userData.coins >= `${COINS_COST}`) {
            userData.coins -= debitCoins; 
            fs.writeFileSync(userJsonPath, JSON.stringify(userData, null, 2));
            isPremium = true;

            const solankMessage = solankService(userData, debitCoins, baileysMessage);
            await sendReply("Abrindo Solank... O seu banco Robótico");
            setTimeout(async () => {
                await sendReply(solankMessage);
            }, 1000);
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
        return isPremium || isDev;
    }

    return false;
};
