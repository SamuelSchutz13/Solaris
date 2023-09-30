const { JSON_DIR, DEV_ID } = require('../config');
const fs = require('fs');

exports.checkPermission = async ({ type, bot, userJid, remoteJid }) => {
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

    let isPremium = false; 
    const userJsonPath = `${JSON_DIR}/user/${userJid.split('@')[0]}.json`;

    if (fs.existsSync(userJsonPath)) {
        const userData = JSON.parse(fs.readFileSync(userJsonPath));
        if (userData.premium && userData.premium === true) {
            isPremium = true;
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
        return isPremium;
    }

    return false;
};
