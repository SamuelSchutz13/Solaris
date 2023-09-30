const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "unmute",
    description: "Irá abrir o chat para todos os membros",
    commands: ["unmute", "desmutar"],
    usage: `${getRandomPrefix()}unmute`,
    handle: async ({
        bot,
        remoteJid,
        sendReply,
        sendWaitReply,
        sendSuccessReact,
    }) => {
        await bot.groupSettingUpdate(remoteJid, 'not_announcement');

        await sendWaitReply();
        await sendSuccessReact();
        await sendReply("Chat desmutado com sucesso!");
    },
};
