const { TEMP_DIR } = require("../../config");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "toimage",
    description: "Transformarei figurinhas estáticas em imagem",
    commands: ["toimage", "toimg"],
    usage: `${getRandomPrefix()}toimage (marque a figurinha) ou ${getRandomPrefix()}toimage (responda a figurinha)`,
    handle: async ({
        isSticker,
        sendWaitReply,
        downloadSticker,
        baileysMessage,
        sendImageFromFile,
    }) => {
        if (!isSticker) {
            throw new InvalidParameterError("Você precisa enviar um sticker!");
        }
        
        const inputPath = await downloadSticker(baileysMessage, `${TEMP_DIR}/${baileysMessage?.messageTimestamp}.webp`);
        const outputPath = path.resolve(`${TEMP_DIR}/${baileysMessage?.messageTimestamp}.png`);
    
        exec(`ffmpeg -i ${inputPath} ${outputPath}`, async (error) => {
            if (error) {
                console.log(error);
                throw new Error(error);
            }

            await sendWaitReply();
            await sendImageFromFile(outputPath);
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });
    },
};
