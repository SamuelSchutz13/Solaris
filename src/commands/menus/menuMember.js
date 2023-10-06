const { PREFIX1, PREFIX2, PREFIX3, BOT_NAME, DEV_NAME, AUDIOS_DIR, IMAGES_DIR, BOT_VERSION } = require("../../config");
const { getBuffer } = require("../../services/imageService");
const { getRandomPrefix } = require("../../services/prefixService");
const path = require("path");

module.exports = {
    name: "members",
    description: "Menu de Comandos de Membros",
    commands: ["member", "membro"],
    usage: `${getRandomPrefix()}member`,
    handle: async ({
        sendAudioFromFile,
        baileysMessage,
        sendReact,
        remoteJid,
        bot,
    }) => {
        const date = new Date();
        const groupMeta = await bot.groupMetadata(remoteJid);
        const dateGroupCreated = new Date(groupMeta.creation * 1000).toLocaleDateString("pt-br");
        let imageBuffer;

        await sendReact('🚀');
        const menuMember = (`
╭━━⪩ *${BOT_NAME}* ⪨━━
▢
▢ • *Grupo:* ${groupMeta.subject}
▢ • *Integrantes:* ${groupMeta.size}
▢ • *Data de Criação:* ${dateGroupCreated}
▢ • *Data de Hoje:* ${date.toLocaleDateString("pt-br")}
▢ • *Horário:* ${date.toLocaleTimeString("pt-br")}
▢ • *Prefixo de Comandos:* ${PREFIX1} ${PREFIX2} ${PREFIX3}
▢
▢
╰━━─「🪐」─━━

╭━━⪩ *Menu de Membros* ⪨━━
▢
▢ • ${getRandomPrefix()}cep
▢ • ${getRandomPrefix()}check
▢ • ${getRandomPrefix()}clear
▢ • ${getRandomPrefix()}cnpj
▢ • ${getRandomPrefix()}copyPaste-list
▢ • ${getRandomPrefix()}copyPaste-search
▢ • ${getRandomPrefix()}couple
▢ • ${getRandomPrefix()}cpf
▢ • ${getRandomPrefix()}group
▢ • ${getRandomPrefix()}morseDecode
▢ • ${getRandomPrefix()}morseEncode
▢ • ${getRandomPrefix()}personalizedChance
▢ • ${getRandomPrefix()}sticker
▢ • ${getRandomPrefix()}sticker-emoji
▢ • ${getRandomPrefix()}surname
▢ • ${getRandomPrefix()}to-image
▢ • ${getRandomPrefix()}top3
▢ • ${getRandomPrefix()}user
▢ • ${getRandomPrefix()}username
▢ • ${getRandomPrefix()}wame
▢
╰━━─「🚀」─━━

╭━━⪩ *Menu de Membros _Premium_* ⪨━━
▢
★ • ${getRandomPrefix()}copyPaste-add
★ • ${getRandomPrefix()}copyPaste-remove
★ • ${getRandomPrefix()}gpt *Manutenção*
★ • ${getRandomPrefix()}news
★ • ${getRandomPrefix()}weather
★ • ${getRandomPrefix()}youtubeSeach
▢
╰━━─「💫」─━━

╭━━⪩ *Descrição* ⪨━━
▢
▢ • *Desenvolvedor:* ${DEV_NAME}
▢ • *Versão:* ${BOT_VERSION}
▢
╰━━─「🌕」─━━
        `);

        try {
            const image = await bot.profilePictureUrl(remoteJid, "image");
            imageBuffer = await getBuffer(image);
            await bot.sendMessage(
                remoteJid,
                { image: imageBuffer, caption: menuMember },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) }
            );
        } catch (error) {
            console.error(error);
            imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
            await bot.sendMessage(
                remoteJid,
                { image: { url: imageBuffer }, caption: menuMember },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) }
            );
        }

        await sendAudioFromFile(`${AUDIOS_DIR}/menu/menuMember.mp3`);
    },
};
