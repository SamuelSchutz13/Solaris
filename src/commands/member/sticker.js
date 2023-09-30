const { DEV_NAME, BOT_NAME } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { StickerTypes, Sticker } = require("wa-sticker-formatter");
const { getRandomPrefix } = require("../../services/prefixService");
const fs = require("fs");

module.exports = {
    name: "sticker",
    description: "Farei figurinhas de imagem/gif e vídeo",
    commands: ["sticker", "s", "fig", "f"],
    usage: `${getRandomPrefix()}sticker (marque a imagem/gif/video) ou ${getRandomPrefix()}sticker (responda a imagem/gif/video)`,
    handle: async ({
        bot,
        isImage,
        isText,
        isVideo,
        remoteJid,
        baileysMessage,
        sendWaitReply,
        sendErrorReply,
        sendSuccessReact,
    }) => {               
        const date = new Date();
        
        if (!isImage && !isVideo && !isText) {
            throw new InvalidParameterError(
                "Você precisa marcar uma imagem/gif/video ou responder a uma imagem/gif/video"
            );
        }

        if(isImage) {
            try {
                const stream = await downloadContentFromMessage(baileysMessage?.message?.extendedTextMessage?.contextInfo?.viewOnceMessage?.message?.imageMessage 
                    || baileysMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage 
                    || baileysMessage?.message?.imageMessage, "image");

                let buffer = Buffer.from([]);

                for await(const chuck of stream) {
                    buffer = Buffer.concat([buffer, chuck]);
                }

                const sticker = new Sticker(buffer, {
                    pack: ` ⚝ ⇝ Solicitado por:\n ⚝ ⇝ Data:\n ⚝ ⇝ Hora:\n ⚝ ⇝ Bot:\n ⚝ ⇝ Dono:`,
                    author: ` ⚝ ${baileysMessage?.pushName}\n ⚝ ${date.toLocaleDateString("pt-br")}\n ⚝ ${date.toLocaleTimeString("pt-br")}\n ⚝ ${BOT_NAME}\n ⚝ ${DEV_NAME}`,
                    type: StickerTypes.FULL,
                });

                await sendWaitReply();
                await sendSuccessReact();
                await bot.sendMessage(remoteJid, await sticker.toMessage());
            } catch(error) {
                console.log(error);
                throw new Error(error);
            }
        } else {
            const sizeInSeconds = 10;
            
            const seconds =
                baileysMessage.message?.videoMessage?.seconds ||
                baileysMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
                ?.videoMessage?.seconds;

            const haveSecondsRule = seconds <= sizeInSeconds;

            if (!haveSecondsRule) {
                fs.unlinkSync(inputPath);
                await sendErrorReply(`O vídeo que você enviou tem mais de ${sizeInSeconds} segundos!

Envie um vídeo menor!`);
                return;
            }

            const stream = await downloadContentFromMessage(baileysMessage?.message?.extendedTextMessage?.contextInfo?.viewOnceMessage?.message?.videoMessage 
                || baileysMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage 
                || baileysMessage?.message?.videoMessage, "video");

                let buffer = Buffer.from([]);

                for await(const chuck of stream) {
                    buffer = Buffer.concat([buffer, chuck]);
                }

                const sticker = new Sticker(buffer, {
                    pack: ` ⚝ ⇝ Solicitado por:\n ⚝ ⇝ Data:\n ⚝ ⇝ Hora:\n ⚝ ⇝ Bot:\n ⚝ ⇝ Dono:`,
                    author: ` ⚝ ${baileysMessage?.pushName}\n ⚝ ${date.toLocaleDateString("pt-br")}\n ⚝ ${date.toLocaleTimeString("pt-br")}\n ⚝ ${BOT_NAME}\n ⚝ ${DEV_NAME}`,
                    type: StickerTypes.FULL,
                });

                await sendWaitReply();
                await sendSuccessReact();
                await bot.sendMessage(remoteJid, await sticker.toMessage());
        } 
    },
};
