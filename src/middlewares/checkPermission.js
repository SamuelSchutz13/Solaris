const { JSON_DIR, DEV_ID } = require('../config');
const { solankService } = require('../services/solankService');
const fs = require('fs');

exports.checkPermission = async ({ 
    type, 
    bot, 
    userJid, 
    remoteJid, 
    baileysMessage,  
    sendSuccessReply }) => {

    if (type === "member" || type === "menu") {
        return true;
    }

    const { participants, owner } = await bot.groupMetadata(remoteJid);

    const participant = participants.find(
        (participant) => participant.id === userJid
    );

    if (!participant) {
        return false;
    }

    const isDev = participant.id === `${DEV_ID}`;
    const isOwner = participant.id === owner || participant.admin === "superadmin";
    const isAdmin = participant.admin === "admin";

    try {
        const userData = fs.readFileSync(`${JSON_DIR}/user/${userJid.split('@')[0]}.json`, 'utf8');
        const premiumData = JSON.parse(userData);

        isPremium = premiumData.premium;
        userCoins = premiumData.coins || 0;
    } catch (error) {
        console.log(error);
        isPremium = false;
        userCoins = 0;
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
        if (isPremium && userCoins >= 5) {
            return true;
        }
        
        if (!isPremium && userCoins >= 5) {
            userCoins -= 5;

            const userJsonPath = `${JSON_DIR}/user/${userJid.split('@')[0]}.json`;
            const userJsonData = fs.readFileSync(userJsonPath, 'utf8');
            const userData = JSON.parse(userJsonData);
            userData.coins = userCoins;
            fs.writeFileSync(userJsonPath, JSON.stringify(userData, null, 2), 'utf8');

            await sendSuccessReply(solankService(userData, 5 ,baileysMessage));
        }

        return isPremium || userCoins >= 5 || isDev;
    }

    return false;
};
