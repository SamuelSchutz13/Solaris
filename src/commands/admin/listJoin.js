const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "listJoin",
    description: "Lista de Requisições de Entrada",
    commands: ["listJoin", "listjoin"],
    usage: `${getRandomPrefix()}listJoin`,
    handle: async ({
        sendSuccessReact, 
        sendSuccessReply, 
        remoteJid, 
        sendWaitReply,
        bot,
    }) => {
        const listJoin = await bot.groupRequestParticipantsList(remoteJid);

        const numberOfRequests = listJoin.length > 0 ? listJoin.length : "0";

        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`Este Grupo possui *${numberOfRequests}* Requisições de entrada`);    
    },
};
