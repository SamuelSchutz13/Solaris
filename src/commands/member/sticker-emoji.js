const { getRandomPrefix } = require("../../services/prefixService");
const { StickerTypes, Sticker } = require("wa-sticker-formatter");
const { STICKER_API_KEY, BOT_NAME, DEV_NAME } = require("../../config");

module.exports = {
    name: "sticker-emoji",
    description: "Descrição do comando",
    commands: ["sticker-emoji", "s-emoji"],
    usage: `${getRandomPrefix()}sticker-emoji 🤖`,
    handle: async ({
        baileysMessage,
        sendWarningReact,
        sendWarningReply,
        sendSuccessReact, 
        sendWaitReply,
        remoteJid,
        args,
        bot,
    }) => {
        const date = new Date();

        if(!args[0]) {
            await sendWarningReact();
            await sendWarningReply(`Você deve inserir um emoji`);
        }

        const emojiData = await fetch(`https://emoji-api.com/emojis?search=${args}&access_key=${STICKER_API_KEY}`)
            .then(response => response.json());

        console.log(emojiData);

        if(!emojiData) {
            return null;
        }

        const emoji = `https://emojiapi.dev/api/v1/${(emojiData[0].unicodeName.substring(5).replace(/\s+/g, '_'))}/512.png`;   
    
        const sticker = new Sticker(emoji, {
            pack: ` ⚝ ⇝ Solicitado por:\n ⚝ ⇝ Data:\n ⚝ ⇝ Hora:\n ⚝ ⇝ Bot:\n ⚝ ⇝ Dono:`,
            author: ` ⚝ ${baileysMessage?.pushName}\n ⚝  ${date.toLocaleDateString("pt-br")}\n ⚝  ${date.toLocaleTimeString("pt-br")}\n ⚝ ${BOT_NAME}\n ⚝ ${DEV_NAME}`,
            type: StickerTypes.FULL,
        });
    
        await sendWaitReply();
        await sendSuccessReact();
        await bot.sendMessage(remoteJid, await sticker.toMessage());
    },
};
