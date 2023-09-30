const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "mute",
    description: "Irá fechar o chat apenas para administradores",
    commands: ["mute", "mutar"],
    usage: `${getRandomPrefix()}mute`,
    handle: async ({
        bot,
        remoteJid,
        sendReply,
        sendWaitReply,
        sendSuccessReact,
    }) => {
        await bot.groupSettingUpdate(remoteJid, 'announcement');

        await sendWaitReply();
        await sendSuccessReact();
        await sendReply("Chat mutado com sucesso!");
    },
};
