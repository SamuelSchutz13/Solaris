const { processUserPremium } = require('../services/premiumPermissionService'); 
const { DEV_ID } = require('../config');

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

    const isDev = participant.id === DEV_ID; 
    const { isUserPremium, isGroupPremium } = await processUserPremium(userJid, remoteJid, type, baileysMessage, sendReply);

    const isOwner = participant.id === owner || participant.admin === "superadmin";
    const isAdmin = participant.admin === "admin";

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