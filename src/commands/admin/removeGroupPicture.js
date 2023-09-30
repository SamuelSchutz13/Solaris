const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "removePicture",
    description: "Remove foto para o perfil do grupo",
    commands: ["removePicture", "removeFoto", "removefoto"],
    usage: `${getRandomPrefix()}removePicture`,
    handle: async ({
        sendSuccessReact, 
        sendSuccessReply, 
        sendWaitReply,
        remoteJid, 
        bot
    }) => {
        await bot.removeProfilePicture(remoteJid);

        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`Foto do grupo removida com sucesso`);
    },
};
