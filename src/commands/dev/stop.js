const { getRandomPrefix } = require("../../services/prefixService");
const { exec } = require("child_process");

module.exports = {
    name: "stop",
    description: "Irá parar o bot",
    commands: ["stop"],
    usage: `${getRandomPrefix()}stop`,
    handle: async ({ 
    }) => {
        exec("cls && pm2 stop ./src/index.js --name solaris-bot", (error) => {
            if (error) {
                console.error(error);
                throw new Error(error);
            }
        });
        console.log('Bot parado com sucesso!');
    },
};