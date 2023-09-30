const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "title",
    description: "Altera o nome do grupo que você desejar",
    commands: ["titleGroup", "tituloGrupo", "titulogrupo"],
    usage: `${getRandomPrefix()}titleGroup`,
    handle: async ({
        bot,
        remoteJid,
        sendReply,
        sendWaitReply,
        sendSuccessReact,
        args,
    }) => {
        if(!args[0]) {
            throw new InvalidParameterError("Você precisa enviar um titulo para o grupo");
        }

        await bot.groupUpdateSubject(remoteJid, args[0]);

        await sendWaitReply();
        await sendSuccessReact();
        await sendReply("Nome do grupo alterado com sucesso!");
    },
};
