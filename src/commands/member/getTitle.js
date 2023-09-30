const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "title",
    description: "Mostra o nome do Grupo",
    commands: ["getTitle", "getitle", "getTitulo", "gettitulo"],
    usage: `${getRandomPrefix()}getTitle`,
    handle: async ({  
        sendWaitReply, 
        sendSuccessReply, 
        sendSuccessReact, 
        remoteJid, 
        bot,
    }) => {
    const groupMetaData = (await bot.groupMetadata(remoteJid));

    if(!groupMetaData.subject) {
        throw new InvalidParameterError("Não existe nome neste grupo");
    }

    await sendWaitReply();
    await sendSuccessReact();
    await sendSuccessReply(`${groupMetaData.subject}`);

    },
};
