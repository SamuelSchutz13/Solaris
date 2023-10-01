const { BOT_NUMBER, IMAGES_DIR } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { getRandomPrefix } = require("../../services/prefixService");
const { getBuffer } = require("../../services/imageService");
const path = require("path");

module.exports = {
    name: "promover",
    description: "Promoverei um membro do grupo",
    commands: ["promote", "promover"],
    usage: `${getRandomPrefix()}promote @marcar_membro ou ${getRandomPrefix()}promote (mencionando uma mensagem)`,
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
        try {
            if (!args.length && !isReply) {
                throw new InvalidParameterError(
                "Você precisa mencionar ou marcar um membro!"
                );
            }

            const memberToPromoteJid = isReply ? replyJid : toUserJid(args[0]);
            const memberToPromoteNumber = onlyNumbers(memberToPromoteJid);

            if(memberToPromoteNumber.length < 7 || memberToPromoteNumber.length > 15) {
                throw new InvalidParameterError("Número inválido!");
            }

            if(memberToPromoteJid === userJid) {
                throw new DangerError("Você não pode promover você mesmo!");
            }

            const botJid = toUserJid(BOT_NUMBER); 

            if(memberToPromoteJid === botJid) { 
                throw new DangerError("Você não pode me remover!"); 
            }

            const groupMetaData = (await bot.groupMetadata(remoteJid));
            let imageBuffer;

            await sendWaitReply();
            await sendSuccessReact();
            try {
                const image = await bot.profilePictureUrl(memberToPromoteJid, "image");
                imageBuffer = await getBuffer(image);
                await bot.sendMessage(remoteJid, 
                    { image: imageBuffer, caption: `O membro @${memberToPromoteNumber} foi promovido a administrador no grupo ${groupMetaData.subject}`, mentions: [memberToPromoteJid]},
                    { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
                );
            } catch (error) {
                console.error(error);
                imageBuffer = path.resolve(`${IMAGES_DIR}/default.jpg`);
                await bot.sendMessage(remoteJid, 
                    { image: { url: imageBuffer }, caption: `O membro @${memberToPromoteNumber} foi promovido a administrador no grupo ${groupMetaData.subject}`, mentions: [memberToPromoteJid] },
                    { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
                );
            }

            await bot.groupParticipantsUpdate(remoteJid, [memberToPromoteJid], "promote");
        } catch(error) {
            console.log(error);
            throw new Error(error);
        }   
    },
};
