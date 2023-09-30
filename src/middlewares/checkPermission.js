const { DEV_ID, JSON_DIR } = require('../config');
const fs = require('fs');

exports.checkPermission = async ({ 
    type, 
    bot, 
    userJid, 
    remoteJid }) => {
    if (type === "member" || "menu") {
        return true;
    }

    const { participants, owner } = await bot.groupMetadata(remoteJid);

    const participant = participants.find(
        (participant) => participant.id === userJid
    );

    if (!participant) {
        return false;
    }

    const isDev = `${DEV_ID}`;
    const isOwner = userJid.replace(/^@/, "") === owner || participant.admin === "superadmin";
    const isAdmin = participant.admin === "admin";

    let isPremium = false; 
    const userJSONFile = (`${JSON_DIR}/json/${userJid.replace(/^@/, "")}.json`);

    if (fs.existsSync(userJSONFile)) {
        const userData = JSON.parse(fs.readFileSync(userJSONFile));
        isPremium = userData.premium.some((item) => item.memberToJid === userJid.replace(/^@/, "") && item.premium);
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
        return isPremium;
    }

    return false;
};