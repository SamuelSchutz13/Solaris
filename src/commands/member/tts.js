const { TEMP_DIR } = require("../../config");
const gtts = require('node-gtts');
const fs = require("fs");
const Utils = require("../../utils/numberOfMessage");
const { getRandomPrefix } = require("../../services/prefixService");
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = {
    name: "tts",
    description: "Transformarei sua mensagem em áudio",
    commands: ["tts"],
    usage: `${getRandomPrefix()}tts <linguage> <mensagem>`,
    handle: async ({  
        sendWarningReact, 
        sendWarningReply, 
        sendSuccessReact, 
        sendAudioFromFile,
        baileysMessage,
        sendWaitReply,
        sendReply,
    }) => {
        await sendReply(`*Painel de linguagens*

*Africana:* af
*Árabe:* ar
*Catalão:* ca
*Chinês:* ch
*Inglês:* us
*Francês:* fr
*Alemão:* al
*Húngaro:* hu
*Italiano:* it
*Japonês:* jp
*Coreano:* ko
*Português:* br
*Russo:* ru
*Espanhol:* es
*Sueco:* sv
*Turco:* tr
            `);

            const utils = new Utils();
            const languages = [
                {
                    af: "af",
                    ar: "ar",
                    ca: "ca",
                    ch: "zh",
                    us: "en",
                    fr: "fr",
                    al: "de",
                    hu: "hu",
                    it: "it",
                    jp: "ja",
                    ko: "ko",
                    br: "pt-br",
                    ru: "ru",
                    es: "es",
                    sv: "sv",
                    tr: "tr",
                },
            ];

        for(let attr in languages) {
            if (!languages[attr]) {
                await sendWarningReact();
                await sendWarningReply("Linguagem não suportada. Consulte o painel de linguagens");
                return;
            }

            if(languages[attr][utils.commandSlice(baileysMessage?.message?.conversation, 4).toLowerCase().split(" ")[0]]) {
                if(utils.commandSlice(baileysMessage?.message?.conversation, 7).length >= 200) {
                    await sendWarningReact();
                        await sendWarningReply(`
                            Você precisa digitar e/ou diminuir o tamanho da mensagem exemplo: ${PREFIX}tts br olá mundo
                        `);
                } else {
                    gtts(languages[attr][utils.commandSlice(baileysMessage?.message?.conversation, 4).toLowerCase().split(" ")[0]])
                        .save(`${TEMP_DIR}/${baileysMessage?.messageTimestamp}.mp3`, utils.commandSlice(baileysMessage?.message?.conversation, 7));
                        await sleep(2000);
            
                    await sendWaitReply();
                    await sendSuccessReact();
                    await sendAudioFromFile(`${TEMP_DIR}/${baileysMessage?.messageTimestamp}.mp3`);
                    await sleep(1000);
                    fs.unlinkSync(`${TEMP_DIR}/${baileysMessage?.messageTimestamp}.mp3`);
                }
            }
        }
    },
};
