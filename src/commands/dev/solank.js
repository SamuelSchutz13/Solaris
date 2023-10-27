const { getRandomPrefix } = require("../../services/prefixService");
const { JSON_DIR } = require("../../config");
const fs = require("fs");

module.exports = {
    name: "solank",
    description: "Veja quantos coins tem no banco do Solank",
    commands: ["solank"],
    usage: `${getRandomPrefix()}solank`,
    handle: async ({
        sendWarningReply,
        sendWarningReact,
        sendSuccessReact, 
        sendSuccessReply,
    }) => {
        const solarcoinDataPath = `${JSON_DIR}/solank/safe.json`;

        if (fs.existsSync(solarcoinDataPath)) {
            try {
                const solarcoinData = JSON.parse(fs.readFileSync(solarcoinDataPath, 'utf-8'));

                const totalSolarcoins = solarcoinData.coins;
                
                await sendSuccessReact();
                await sendSuccessReply(`o banco Solank tem: *${totalSolarcoins}* solarcoins`);
            } catch (error) {
                console.error(error);
            }
        } else {
            await sendWarningReact();
            await sendWarningReply("O arquivo de dados de solarcoin não existe. O banco do Solank ainda não possui solarcoins");
        }
    },
};
