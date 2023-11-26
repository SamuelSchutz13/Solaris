const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "controlPanel",
    description: "Painel de controle de seu grupo do que está ativo e inativo",
    commands: ["controlPanel", "controlpanel", "paineldecontrole"],
    usage: `${getRandomPrefix()}controlPanel`,
    handle: async ({
        bot,
        remoteJid,
        baileysMessage, 
        sendSuccessReply,
        sendSuccessReact,
    }) => { 
        const groupMeta = (await bot.groupMetadata(remoteJid));



        await sendSuccessReact();
        await sendSuccessReply(`${groupMeta.subject}

*Habilitar Comandos:* 「_Em Breve_」
*Habilitar Reportar:*「 」
        `);
    },
};