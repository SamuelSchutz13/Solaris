const { BOT_NAME, PREFIX1, PREFIX2, PREFIX3, DEV_NAME, BOT_VERSION } = require("../config");
const { getRandomPrefix } = require("../services/prefixService");

const menuMessage = (
    groupMeta, 
    dateGroupCreated, 
    baileysMessage,
) => {
    const date = new Date();

    return `
╭━━⪩ *${BOT_NAME}* ⪨━━
▢
▢ • *Grupo:* ${groupMeta?.subject}
▢ • *Integrantes:* ${groupMeta.size}
▢ • *Data de Criação:* ${dateGroupCreated}
▢ • *Data de Hoje:* ${date.toLocaleDateString("pt-br")}
▢ • *Horário:* ${date.toLocaleTimeString("pt-br")}
▢ • *Solicitado por:* ${baileysMessage.pushName}
▢ • *Prefixo de Comandos:* ${PREFIX1} ${PREFIX2} ${PREFIX3}
▢
▢ • ★ = Comandos _Premium_
▢
╰━━─「🪐」─━━

╭━━⪩ *Menus de Comandos* ⪨━━
▢
▢ • ${getRandomPrefix()}admin
▢ • ${getRandomPrefix()}member
▢ • ${getRandomPrefix()}games
▢ • ${getRandomPrefix()}group
▢ • ${getRandomPrefix()}bot
▢ • ${getRandomPrefix()}help   
▢
╰━━─「👽」─━━

╭━━⪩ *Descrição* ⪨━━
▢
▢ • *Desenvolvedor:* ${DEV_NAME}
▢ • *Versão:* ${BOT_VERSION}
▢
╰━━─「🌕」─━━`;
};

const waitMessages = [
    "Carregando os dados...",
    "Espere sentado enquanto estou enviando...",
    "Aguarde um momento...",
    "Calma ae, tô enviando já...",
    "Beba água enquanto isso...",
    "Tic-Tac, Tic-Tac... Estou processando...",
    "Tome um banho enquanto isso...",
    "Estou calculando os bits e bytes aguarde...",
    "Mergulhando no código binário...",
    "Desvendando os segredos da internet...",
    "Dando um CRTL + C e CTRL + V no texto...",
    "Estou enviando, aguarde...",
];

function getRandomWaitMessage() {
    const randomIndex = Math.floor(Math.random() * waitMessages.length);
    return waitMessages[randomIndex];
};

module.exports = {
    getRandomWaitMessage,
    menuMessage,
};