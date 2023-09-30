const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "revokeGroupCode  ",
    description: "Descrição do comando",
    commands: ["revokeGroupCode", "revokegroupcode"],
    usage: `${getRandomPrefix()}revokegroupcode`,
    handle: async ({
        sendSuccessReact, 
        sendWaitReply,
        sendReply, 
        remoteJid, 
        bot,
    }) => {
        const revokeGroupCode = await bot.groupRevokeInvite(remoteJid);

        await sendWaitReply();
        await sendSuccessReact();
        await sendReply(`Novo Código: https://chat.whatsapp.com/${revokeGroupCode}`);
    },
};
