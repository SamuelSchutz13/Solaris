const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "report",
    description: "Reporta algum ato de algum membro e marca uma possibilidade de ban quando atingir um certo número de reports",
    commands: ["report", "reportar"],
    usage: `${getRandomPrefix()}report`,
    handle: async ({

    }) => {
        
    },
};