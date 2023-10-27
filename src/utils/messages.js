const { JSON_DIR, BOT_NAME, PREFIX1, PREFIX2, PREFIX3, DEV_NAME, BOT_VERSION } = require("../config");
const { getRandomPrefix } = require("../services/prefixService");
const { toUserJid, onlyNumbers } = require("../utils");
const fs = require("fs");

const menuMessage = (
    groupMeta, 
    dateGroupCreated, 
    baileysMessage,
) => {
    const date = new Date();

    const memberToNameJid = toUserJid(baileysMessage?.key?.participant);
    const memberNameNumber = onlyNumbers(memberToNameJid);
    const userJsonPath = `${JSON_DIR}/user/${memberNameNumber}.json`;
    let userSurname = baileysMessage.pushName;

    if (fs.existsSync(userJsonPath)) {
        const jsonData = fs.readFileSync(userJsonPath, 'utf-8');
        const data = JSON.parse(jsonData);
        
        if (data.surname) {
            userSurname = data.surname; 
        } else {
            userSurname = baileysMessage?.pushName; 
        }
    }

    return `
╭━━⪩ *${BOT_NAME}* ⪨━━
▢
▢ • *Grupo:* ${groupMeta?.subject}
▢ • *Integrantes:* ${groupMeta.size}
▢ • *Data de Criação:* ${dateGroupCreated}
▢ • *Data de Hoje:* ${date.toLocaleDateString("pt-br")}
▢ • *Horário:* ${date.toLocaleTimeString("pt-br")}
▢ • *Solicitado por:* ${userSurname}
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