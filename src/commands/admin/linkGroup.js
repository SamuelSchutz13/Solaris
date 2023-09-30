const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "linkGroup",
    description: "Pega o link de convite do grupo",
    commands: ["linkGroup", "linkgroup"],
    usage: `${getRandomPrefix()}linkGroup`,
    handle: async ({
        sendSuccessReact, 
        sendReply, 
        sendWaitReply,
        remoteJid,
        bot, 
    }) => {
        const codeGroup = await bot.groupInviteCode(remoteJid);

        await sendWaitReply();
        await sendSuccessReact();
        await sendReply(`Código do Grupo: https://chat.whatsapp.com/${codeGroup}`);
    },
};
