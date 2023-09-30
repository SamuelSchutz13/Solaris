const { gpt } = require("../../services/gptService");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "gpt",
    description: "Comandos de  IA!",
    commands: ["gpt", "solaris"],
    usage: `${getRandomPrefix()}gpt como vai Solaris?`,
    handle: async ({
        sendSuccessReply,
        sendWaitReply,
        sendSuccessReact,
        args,
    }) => {
        const responseGPT = await gpt(args[0]);
        
        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(responseGPT);
    },
};
