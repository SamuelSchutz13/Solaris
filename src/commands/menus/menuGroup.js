const { PREFIX1, PREFIX2, PREFIX3, PREFIX4, BOT_NAME, DEV_NAME, IMAGES_DIR, BOT_VERSION } = require("../../config");
const { getBuffer } = require("../../services/imageService");
const { getRandomPrefix } = require("../../services/prefixService");
const path = require("path");

module.exports = {
    name: "group",
    description: "Menu de Comandos do Grupo",
    commands: ["group", "grupo"],
    usage: `${getRandomPrefix()}group`,
    handle: async ({
        baileysMessage,
        sendReact,  
        remoteJid,
        bot, 
    }) => {
        const date = new Date();
        const groupMeta = (await bot.groupMetadata(remoteJid));
        const dateGroupCreated = new Date(groupMeta.creation * 1000).toLocaleDateString("pt-br");
        let imageBuffer;
        
        await sendReact('🌎');
        const menuGroup = (`

╭━━⪩ *${BOT_NAME}* ⪨━━
▢
▢ • *Grupo:* ${groupMeta.subject}
▢ • *Integrantes:* ${groupMeta.size}
▢ • *Data de Criação:* ${dateGroupCreated}
▢ • *Data de Hoje:* ${date.toLocaleDateString("pt-br")}
▢ • *Horário:* ${date.toLocaleTimeString("pt-br")}
▢ • *Prefixo de Comandos:* ${PREFIX1} ${PREFIX2} ${PREFIX3} ${PREFIX4}
▢
▢ • ★ = Comandos _Premium_
▢
╰━━─「🪐」─━━

╭━━⪩ *Menu do Grupo* ⪨━━
▢
▢ • ${getRandomPrefix()}clear
▢ • ${getRandomPrefix()}getDesc
▢ • ${getRandomPrefix()}getPicture
▢ • ${getRandomPrefix()}getTitle
▢
╰━━─「🌎」─━━

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
                { image: imageBuffer, caption: menuGroup },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        } catch (error) {
            console.error(error);
            imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
            await bot.sendMessage(remoteJid, 
                { image: { url: imageBuffer }, caption: menuGroup },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        }
    },
};
