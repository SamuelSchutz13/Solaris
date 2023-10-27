const fs = require("fs");
const { getRandomPrefix } = require("../../services/prefixService");
const { toUserJid, onlyNumbers } = require("../../utils");
const { JSON_DIR } = require("../../config");

module.exports = {
    name: "machine",
    description: "Gire o caça niquel no Bot",
    commands: ["slotMachine", "slot-machine", "slotmachine", "caça-niquel"],
    usage: `${getRandomPrefix()}slotMachine`,
    handle: async ({
        sendSuccessReact,
        sendReply,
        sendWaitReply,
        baileysMessage,
    }) => {
        const memberToNameJid = toUserJid(baileysMessage?.key?.participant);
        const memberNameNumber = onlyNumbers(memberToNameJid);

        const solarcoinDataPath = `${JSON_DIR}/solank/safe.json`;
        const userJsonPath = `${JSON_DIR}/user/${memberNameNumber}.json`;

        if (fs.existsSync(solarcoinDataPath) && fs.existsSync(userJsonPath)) {
            try {
                const solarcoinData = JSON.parse(fs.readFileSync(solarcoinDataPath, 'utf-8'));
                const userData = JSON.parse(fs.readFileSync(userJsonPath, 'utf-8'));

                if (userData.coins >= 2) {
                    userData.coins -= 2;
                    solarcoinData.coins += 2;

                    fs.writeFileSync(userJsonPath, JSON.stringify(userData, null, 2));
                    fs.writeFileSync(solarcoinDataPath, JSON.stringify(solarcoinData, null, 2));

                    const simbolos = ["🍒", "🍋", "🍊", "🍇", "🍉", "🍓", "🍍", "🔔", "💎", "7️⃣"];
                    const bobina1 = simbolos[Math.floor(Math.random() * simbolos.length)];
                    const bobina2 = simbolos[Math.floor(Math.random() * simbolos.length)];
                    const bobina3 = simbolos[Math.floor(Math.random() * simbolos.length)];

                    let resultado = "Você perdeu";
                    if (bobina1 === bobina2 && bobina1 === bobina3) {
                        resultado = "Você ganhou";
                    }

                    await sendWaitReply();
                    await sendSuccessReact();
                    await sendReply(`
╭─「🎰 CAÇA NÍQUEL 🎰」
│
│─「${bobina1}」「${bobina2}」「${bobina3}」─
│   
│─ ${resultado}
│ 
╰─────────────────

Você gastou 2 solarcoins. Agora você tem ${userData.coins} solarcoins em sua conta
                    `);
                } else {
                    await sendWaitReply();
                    await sendReply("Você não tem solarcoins suficientes para jogar na máquina caça-níquel");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            await sendWaitReply();
            await sendReply("Você não está registrado como um usuário ou o arquivo de dados de solarcoin não existe");
        }
    },
};
