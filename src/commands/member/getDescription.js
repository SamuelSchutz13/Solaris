const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "desc",
    description: "Mostra a descrição do Grupo",
    commands: ["getDesc", "getDescription", "pegardesc", "pegarDescrição"],
    usage: `${getRandomPrefix()}getDesc`,
    handle: async ({  
        sendWaitReply, 
        sendSuccessReply, 
        sendSuccessReact, 
        remoteJid, 
        bot,
    }) => {
    const groupMetaData = (await bot.groupMetadata(remoteJid));

    if(!groupMetaData.desc) {
        throw new InvalidParameterError("Não existe descrição neste grupo");
    }

    await sendWaitReply();
    await sendSuccessReact();
    await sendSuccessReply(`${groupMetaData.desc}`);

    },
};
