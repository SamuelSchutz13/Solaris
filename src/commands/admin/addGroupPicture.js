const { TEMP_DIR } = require("../../config");
const fs = require("fs");
const path = require('path');
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "picture",
    description: "Adiciona foto para o perfil do grupo",
    commands: ["addPicture", "addFoto"],
    usage: `${getRandomPrefix()}addPicture`,
    handle: async ({
        sendSuccessReact, 
        sendSuccessReply, 
        baileysMessage,
        downloadImage,
        sendWaitReply,
        remoteJid, 
        bot
    }) => {
        const inputPath = await downloadImage(baileysMessage, "input");
        const outputPath = path.resolve(TEMP_DIR, "input.jpeg");

        await bot.updateProfilePicture(remoteJid, {url: outputPath});

        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`Foto do grupo adicionada e/ou alterada com sucesso`);

        fs.unlinkSync(inputPath, outputPath);
    },
};
