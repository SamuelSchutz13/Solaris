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
        args,
    }) => {
        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`wa.me/${args[0]}`);
    },
};
