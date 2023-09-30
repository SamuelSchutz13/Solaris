const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "description",
    description: "Altera a descrição do grupo",
    commands: ["descGroup", "descgroup"],
    usage: `${getRandomPrefix()}descGroup`,
    handle: async ({    
        bot,
        remoteJid,
        sendReply,
        sendWaitReply,
        sendSuccessReact,
        args,
    }) => {

        if(!args[0]) {
            throw new InvalidParameterError("Você precisa enviar uma descrição para o grupo");
        }

        await bot.groupUpdateDescription(remoteJid, args[0]);

        await sendWaitReply();
        await sendSuccessReact();
        await sendReply("Descrição do grupo alterada com sucesso!");
    },
};
