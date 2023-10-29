const { BOT_NUMBER, IMAGES_DIR, JSON_DIR } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { getRandomPrefix } = require("../../services/prefixService");
const { getBuffer } = require("../../services/imageService");
const path = require("path");
const fs = require("fs");

module.exports = {
    name: "addCoins",
    description: "Adiciona solarcoins à conta do usuário",
    commands: ["addCoins", "addcoins"],
    usage: `${getRandomPrefix()}addCoins <membro> <numero>`,
    handle: async ({
        args,
        bot,
        isReply,
        replyJid,
        remoteJid,
        baileysMessage,
        sendWaitReply,
        sendSuccessReact,
    }) => {
        if (args.length < 2 && !isReply) {
            throw new InvalidParameterError(
                "Você precisa mencionar um membro e digitar o número de solarcoins a serem adicionadas!"
            );
        }

        const memberToJid = isReply ? replyJid : toUserJid(args[0]);
        const memberToNumber = onlyNumbers(memberToJid);

        if (memberToNumber.length < 7 || memberToNumber.length > 15) {
            throw new InvalidParameterError("Número inválido!");
        }

        const botJid = toUserJid(BOT_NUMBER);

        if (memberToJid === botJid) {
            throw new DangerError("Você não pode adicionar solarcoins à minha conta");
        }

        const debitCoins = parseInt(args[0]);
        if (isNaN(debitCoins) || debitCoins <= 0) {
            throw new InvalidParameterError("Número de solarcoins inválido!");
        }

        let imageBuffer;

        await sendWaitReply();
        await sendSuccessReact();
        try {
            const image = await bot.profilePictureUrl(memberToJid, "image");
            imageBuffer = await getBuffer(image);
            await bot.sendMessage(
                remoteJid,
                {
                    image: imageBuffer,
                    caption: `@${memberToNumber} foram adicionados ${debitCoins} Solarcoins em sua conta`,
                    mentions: [memberToJid],
                },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) }
            );
        } catch (error) {
            console.error(error);
            imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
            await bot.sendMessage(
                remoteJid,
                {
                    image: { url: imageBuffer },
                    caption: `@${memberToNumber} foram adicionados *${debitCoins}* Solarcoins em sua conta`,
                    mentions: [memberToJid],
                },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) }
            );
        }

        const userJsonPath = path.join(`${JSON_DIR}/user/${memberToNumber}.json`);
    
        let userData = {};
        if (fs.existsSync(userJsonPath)) {
            const jsonData = fs.readFileSync(userJsonPath, 'utf-8');
            userData = JSON.parse(jsonData);
        } else {
            userData.memberToJid = memberToJid;
            userData.memberToNumber = memberToNumber;
            userData.premiumExpirationDate = null;
            userData.premium = false;
            userData.coins = 0;
        }

        userData.coins += debitCoins;

        fs.writeFileSync(userJsonPath, JSON.stringify(userData, null, 2));
    },
};
