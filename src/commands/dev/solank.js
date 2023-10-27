const { getRandomPrefix } = require("../../services/prefixService");
const { JSON_DIR } = require("../../config");
const fs = require("fs");

module.exports = {
    name: "solank",
    description: "Veja quantos coins tem no banco do Solank",
    commands: ["solank"],
    usage: `${getRandomPrefix()}solank`,
    handle: async ({
        baileysMessage,
        sendWarningReply,
        sendWarningReact,
        sendSuccessReact, 
        sendReply,
    }) => {
        const solarcoinDataPath = `${JSON_DIR}/solank/safe.json`;

        if (fs.existsSync(solarcoinDataPath)) {
            try {
                const solarcoinData = JSON.parse(fs.readFileSync(solarcoinDataPath, 'utf-8'));

                const totalSolarcoins = formatNumberWithCommas(solarcoinData.coins);
                
                await sendSuccessReact();
                await sendReply(`*Solank*
                
*Usuário Gerente:* ${baileysMessage.pushName}
*Cofre do Solank:* ₹${totalSolarcoins} Solarcoins
                `);
            } catch (error) {
                console.error(error);
            }
        } else {
            await sendWarningReact();
            await sendWarningReply("O arquivo de dados de solarcoin não existe. O banco do Solank ainda não possui solarcoins");
        }
    },
};

function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
