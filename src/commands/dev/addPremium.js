const { BOT_NUMBER, IMAGES_DIR, JSON_DIR } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { getRandomPrefix } = require("../../services/prefixService");
const { getBuffer } = require("../../services/imageService");
const path = require("path");
const moment = require("moment");
const fs = require("fs");

module.exports = {
    name: "addPremium",
    description: "Adiciona o premium ao usuário por 1 mês",
    commands: ["addPremium", "addpremium"],
    usage: `${getRandomPrefix()}addPremium`,
    handle: async ({
        args,
        bot,
        isReply,
        replyJid,
        remoteJid,
        baileysMessage,
        sendWaitReply,
        sendWarningReply,
        sendSuccessReact,
    }) => {
        if (!args.length && !isReply) {
            throw new InvalidParameterError(
                "Você precisa mencionar ou marcar um membro!"
            );
        }

        const memberToJid = isReply ? replyJid : toUserJid(args[0]);
        const memberToNumber = onlyNumbers(memberToJid);

        if (memberToNumber.length < 7 || memberToNumber.length > 15) {
            throw new InvalidParameterError("Número inválido!");
        }

        const botJid = toUserJid(BOT_NUMBER);

        if (memberToJid === botJid) {
            throw new DangerError("Você não pode me promover a Premium!");
        }

        // Calcular a data de expiração do premium em um mês
        const premiumExpirationDate = moment().add(1, 'months').format('DD/MM/YYYY [às] HH:mm:ss');
        let imageBuffer;

        await sendWaitReply();
        await sendSuccessReact();
        try {
            const image = await bot.profilePictureUrl(memberToJid, "image");
            imageBuffer = await getBuffer(image);
            await bot.sendMessage(remoteJid,
                { image: imageBuffer, caption: `@${memberToNumber} agora é Premium até o dia: ${premiumExpirationDate}`, mentions: [memberToJid] },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        } catch (error) {
            console.error(error);
            imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
            await bot.sendMessage(remoteJid,
                { image: { url: imageBuffer }, caption: `O membro @${memberToNumber} agora é Premium até o dia: ${premiumExpirationDate}`, mentions: [memberToJid] },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        }

        const userJsonPath = path.join(`${JSON_DIR}/user/${memberToNumber}.json`);

        let userData = {};
        if (fs.existsSync(userJsonPath)) {
            const jsonData = fs.readFileSync(userJsonPath, 'utf-8');
            userData = JSON.parse(jsonData);
            userData.premiumExpirationDate = premiumExpirationDate;
            userData.premium = true;
        }

        const currentDate = new Date();
        const premiumExpiration = moment(userData.premiumExpirationDate, 'DD/MM/YYYY [às] HH:mm:ss');
        if (premiumExpiration < currentDate) {
            userData.premium = false;
        }

        if (userData.premium && userData.memberToJid === memberToJid) {
            await sendWarningReact();
            await sendWarningReply(`O usuário ${memberToJid} já é premium.`);
        }

        userData.memberToJid = memberToJid;
        userData.memberToNumber = memberToNumber;
        userData.premiumExpirationDate = premiumExpirationDate;
        userData.premium = true;
        userData.coins = userData.coins; 

        fs.writeFileSync(userJsonPath, JSON.stringify(userData, null, 2));
    },
};
