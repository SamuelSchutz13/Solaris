const { JSON_DIR, DEV_ID } = require('../config');
const fs = require('fs');

exports.checkPermission = async ({ type, bot, userJid, remoteJid }) => {
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

    const isDev = participant.id === `${DEV_ID}`;
    const isOwner = participant.id === owner || participant.admin === "superadmin";
    const isAdmin = participant.admin === "admin";

    const premiumData = JSON.parse(fs.readFileSync(`${JSON_DIR}/user/${userJid.split('@')[0]}.json`));

    const isPremium = premiumData.premium.some((item) => item.memberToJid === userJid && item.premium);

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
