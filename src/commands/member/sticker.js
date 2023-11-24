const { DEV_NAME, BOT_NAME, TEMP_DIR } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { StickerTypes, Sticker } = require("wa-sticker-formatter");
const { getRandomPrefix } = require("../../services/prefixService");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

module.exports = {
    name: "sticker",
    description: "Farei figurinhas de imagem/gif e vídeo",
    commands: ["sticker", "s", "fig", "f"],
    usage: `${getRandomPrefix()}sticker (marque a imagem/gif/video) ou ${getRandomPrefix()}sticker (responda a imagem/gif/video)`,
    handle: async ({
        bot,
        isImage,
        isVideo,
        remoteJid,
        baileysMessage,
        baileysMessage,
        sendWaitReply,
        sendErrorReply,
        downloadVideo,
        sendSuccessReact,
        sendStickerFromFile,
    }) => {               
        const date = new Date();
        
        if (!isImage && !isVideo) {
            throw new InvalidParameterError(
                "Você precisa marcar uma imagem/gif/video ou responder a uma imagem/gif/video"
            );
        }

        const outputPath = path.resolve(TEMP_DIR, "output.webp");
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
            const inputPath = await downloadVideo(baileysMessage, "input");
            const sizeInSeconds = 10;

            const seconds =
            baileysMessage.message?.videoMessage?.seconds ||
            baileysMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage ?.videoMessage?.seconds;

            const haveSecondsRule = seconds <= sizeInSeconds;

            if (!haveSecondsRule) {
                fs.unlinkSync(inputPath);
                await sendErrorReply(`O vídeo que você enviou tem mais de ${sizeInSeconds} segundos! Envie um vídeo menor!`);
                return;
            }

            exec( `ffmpeg -i ${inputPath} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${outputPath}`,
                async (error) => {
                    if (error) {
                        console.log(error);
                        fs.unlinkSync(inputPath);
                        throw new Error(error);
                    }
        
                    await sendSuccessReact();
                    await sendStickerFromFile(outputPath);
        
                    fs.unlinkSync(inputPath);
                    fs.unlinkSync(outputPath);
                });
            }
        },
};
