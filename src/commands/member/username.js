const user = require('random-username-generator');
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "username",
    description: "Irei gerar um nome de usuário aleatório para você",
    commands: ["username", "usuario", "user"],
    usage: `${getRandomPrefix()}username`,
    handle: async ({
        sendSuccessReact, 
        sendSuccessReply,
        sendWaitReply,
    }) => {
        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`*Usuário:* ${user.generate()}`);
    },
};
