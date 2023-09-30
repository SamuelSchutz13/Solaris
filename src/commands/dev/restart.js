const { exec } = require("child_process");
const { getRandomPrefix } = require("../../services/prefixService")

module.exports = {
    name: "restart",
    description: "Irá reiniciar o bot",
    commands: ["restart"],
    usage: `${getRandomPrefix()}restart`,
    handle: async ({ 
    }) => {
        exec("pm2 restart ./src/index.js --name solaris-bot", (error) => {
            if (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    },
};