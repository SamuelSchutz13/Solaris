const { getBuffer } = require("../../services/imageService");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "getPicture",
    description: "Pega a foto do grupo",
    commands: ["getFoto", "getPicture"],
    usage: `${getRandomPrefix()}getPicture`,
    handle: async ({
        sendSuccessReact, 
        baileysMessage,
        sendWaitReply, 
        remoteJid, 
        bot, 
    }) => {
        const image = await bot.profilePictureUrl(remoteJid, "image");
        const imageBuffer = await getBuffer(image);
        
        await sendWaitReply();
        await sendSuccessReact(),
        await bot.sendMessage(remoteJid, 
            { image: imageBuffer },
            { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
        );
    },
};
