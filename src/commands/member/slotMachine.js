const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "machine",
    description: "Gire o caça niquel no Bot",
    commands: ["slotMachine","slotmachine", "caça-niquel"],
    usage: `${getRandomPrefix()}slotMachine`,
    handle: async ({
        sendSuccessReact, 
        sendReply,
        sendWaitReply,
    }) => {
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
        `);
    },
};
