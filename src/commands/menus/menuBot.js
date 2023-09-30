const { PREFIX1, PREFIX2, PREFIX3, BOT_NAME, DEV_NAME, AUDIOS_DIR, IMAGES_DIR, BOT_VERSION } = require("../../config");
const { getBuffer } = require("../../services/imageService");
const { getRandomPrefix } = require("../../services/prefixService");
const path = require("path");

module.exports = {
    name: "bot",
    description: "Menu de Comandos do Bot",
    commands: ["bot"],
    usage: `${getRandomPrefix()}bot`,
    handle: async ({
        sendAudioFromFile,
        baileysMessage,
        sendReact,  
        remoteJid,
        bot, 
    }) => {
        const date = new Date();
        const groupMeta = (await bot.groupMetadata(remoteJid));
        const dateGroupCreated = new Date(groupMeta.creation * 1000).toLocaleDateString("pt-br");
        let imageBuffer;

        await sendReact('🤖');
        const menuBot = (`

╭━━⪩ *${BOT_NAME}* ⪨━━
▢
▢ • *Grupo:* ${groupMeta.subject}
▢ • *Integrantes:* ${groupMeta.size}
▢ • *Data de Criação:* ${dateGroupCreated}
▢ • *Data de Hoje:* ${date.toLocaleDateString("pt-br")}
▢ • *Horário:* ${date.toLocaleTimeString("pt-br")}
▢ • *Prefixo de Comandos:* ${PREFIX1} ${PREFIX2} ${PREFIX3}
▢
▢ • ★ = Comandos _Premium_
▢
╰━━─「🪐」─━━

╭━━⪩ *Menu do Bot* ⪨━━
▢
▢ • ${getRandomPrefix()}menu
▢ • ${getRandomPrefix()}ping
▢ • ${getRandomPrefix()}premium
▢
╰━━─「🛸」─━━ 

╭━━⪩ *Descrição* ⪨━━
▢
▢ • *Desenvolvedor:* ${DEV_NAME}
▢ • *Versão:* ${BOT_VERSION}
▢
╰━━─「🌕」─━━
        `)

        try {
            const image = await bot.profilePictureUrl(remoteJid, "image");
            imageBuffer = await getBuffer(image);
            await bot.sendMessage(remoteJid, 
                { image: imageBuffer, caption: menuBot },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        } catch (error) {
            console.error(error);
            imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
            await bot.sendMessage(remoteJid, 
                { image: { url: imageBuffer }, caption: menuBot },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        }

        await sendAudioFromFile(`${AUDIOS_DIR}/menu/menuBot.mp3`);
    },
};

