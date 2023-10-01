const fs = require('fs');
const { getRandomPrefix } = require("../../services/prefixService");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { JSON_DIR, IMAGES_DIR, BOT_NUMBER } = require("../../config");
const { toUserJid, onlyNumbers } = require("../../utils");
const path = require('path');
const { DangerError } = require("../../errors/DangerError");
const { getBuffer } = require("../../services/imageService");

module.exports = {
    name: "surname",
    description: "Adicione um apelido a algum membro do grupo",
    commands: ["surname", "apelido"],
    usage: `${getRandomPrefix()}surname <apelido>`,
    handle: async ({
        bot,
        args,
        isReply,
        replyJid,
        remoteJid, 
        userJid,
        sendWaitReply,
        baileysMessage,
        sendSuccessReact,
    }) => {
        if (!args.length && !isReply) {
            throw new InvalidParameterError(
                "Você precisa mencionar e inserir um apelido ao mesmo"
            );
        }

        const surname = args[0]; 
        if (!surname || surname.trim() === "") {
            throw new InvalidParameterError("Você não inseriu um apelido ao membro");
        }

        const memberToJid = isReply ? replyJid : toUserJid(args[0]);
        const memberToNumber = onlyNumbers(memberToJid);

        if(memberToJid === userJid) {
            throw  DangerError("Você não pode se auto apelidar!");
        }

        const botJid = toUserJid(BOT_NUMBER);

        if(memberToJid === botJid) {
            throw new DangerError("Você não pode me apelidar!");
        }

        const userJsonPath = `${JSON_DIR}/user/${memberToNumber}.json`;

        let userData = {};

        if (fs.existsSync(userJsonPath)) {
            userData = JSON.parse(fs.readFileSync(userJsonPath, 'utf-8'));
        } 

        userData.surname = surname;

        fs.writeFileSync(userJsonPath, JSON.stringify(userData, null, 2));

        await sendWaitReply();
        await sendSuccessReact();
        try {
            const image = await bot.profilePictureUrl(memberToJid, "image");
            imageBuffer = await getBuffer(image);
            await bot.sendMessage(remoteJid, 
                { image: imageBuffer, caption: `O membro @${memberToNumber} foi apelidado como *${surname}*`, mentions: [memberToJid] },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        } catch (error) {
            console.error(error);
            imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
            await bot.sendMessage(remoteJid, 
                { image: { url: imageBuffer }, caption: `O membro @${memberToNumber} foi apelidado como *${surname}*`, mentions: [memberToJid] },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        }

    },
};

