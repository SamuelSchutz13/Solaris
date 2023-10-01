const { BOT_NUMBER, IMAGES_DIR } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { getRandomPrefix } = require("../../services/prefixService");
const { getBuffer } = require("../../services/imageService");
const path = require("path");

module.exports = {
    name: "despromover",
    description: "Despromoverei um membro do grupo",
    commands: ["demote", "rebaixar"],
    usage: `${getRandomPrefix()}demote @marcar_membro ou ${getRandomPrefix()}demote (mencionando uma mensagem)`,
    handle: async ({
        args,
        isReply,
        bot,
        remoteJid,
        replyJid,
        baileysMessage,
        userJid,
        sendWaitReply,
        sendSuccessReact,
    }) => {
        try{ 
            if (!args.length && !isReply) {
                throw new InvalidParameterError(
                    "Você precisa mencionar ou marcar um membro!"
                );
            }

            const memberToDemoteJid = isReply ? replyJid : toUserJid(args[0]);
            const memberToDemoteNumber = onlyNumbers(memberToDemoteJid);

            if(memberToDemoteNumber.length < 7 || memberToDemoteNumber.length > 15) {
                throw new InvalidParameterError("Número inválido!");
            }

            if(memberToDemoteJid === userJid) {
                throw new DangerError("Você não pode despromover você mesmo!");
            }

            const botJid = toUserJid(BOT_NUMBER);

            if(memberToDemoteJid === botJid) {
                throw new DangerError("Você não pode me despromover!");
            }

            const groupMetaData = (await bot.groupMetadata(remoteJid));
            let imageBuffer;

            await sendWaitReply();
            await sendSuccessReact();
            try {
                const image = await bot.profilePictureUrl(memberToDemoteJid, "image");
                imageBuffer = await getBuffer(image);
                await bot.sendMessage(remoteJid, 
                    { image: imageBuffer, caption: `O administrador @${memberToDemoteNumber} foi despromovido a membro no grupo ${groupMetaData.subject}`, mentions: [memberToDemoteJid]},
                    { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
                );
            } catch (error) {
                console.error(error);
                imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
                await bot.sendMessage(remoteJid, 
                    { image: { url: imageBuffer }, caption: `O administrador @${memberToDemoteNumber} foi despromovido a membro no grupo ${groupMetaData.subject}`, mentions: [memberToDemoteJid] },
                    { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
                );
            }

            await bot.groupParticipantsUpdate(remoteJid, [memberToDemoteJid], "demote");
        } catch(error) {
            console.log(error);
            throw new Error(error);
        } 
    },
};
