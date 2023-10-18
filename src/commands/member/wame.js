const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "wame",
    description: "Descrição do comando",
    commands: ["wame"],
    usage: `${getRandomPrefix()}wame`,
    handle: async ({
        sendSuccessReact,
        sendSuccessReply,
        sendWaitReply,
        sendWarningReply,
        sendWarningReact,
        args,
    }) => {
        if (args.length !== 1 || isNaN(args[0])) {
            await sendWarningReact();
            await sendWarningReply("Por favor, insira apenas um número válido.");
            return;
        }

        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`wa.me/${args[0]}`);
    },
};
