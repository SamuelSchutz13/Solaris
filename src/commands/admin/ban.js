const { BOT_NUMBER, IMAGES_DIR } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { getBuffer } = require("../../services/imageService");
const { getRandomPrefix } = require("../../services/prefixService");
const path = require("path");

module.exports = {
    name: "banir",
    description: "Removerei um membro do grupo",
    commands: ["ban", "banir"],
    usage: `${getRandomPrefix()}ban @marcar_membro ou ${getRandomPrefix()}ban (mencionando uma mensagem)`,
    handle: async ({
        args,
        isReply,
        bot,
        remoteJid,
        replyJid,
        userJid,
        sendWaitReply,
        sendSuccessReact,
        baileysMessage,
    }) => {
        try {
            if (!args.length && !isReply) {
                throw new InvalidParameterError(
                    "Você precisa mencionar ou marcar um membro!"
                );
            }   

            const memberToRemoveJid = isReply ? replyJid : toUserJid(args[0]);
            const memberToRemoveNumber = onlyNumbers(memberToRemoveJid);
            if(memberToRemoveNumber.length < 7 || memberToRemoveNumber.length > 15) {
                throw new InvalidParameterError("Número inválido!");
            }

            if(memberToRemoveJid === userJid) {
                throw new DangerError("Você não pode remover você mesmo!");
            }

            const botJid = toUserJid(BOT_NUMBER);

            if(memberToRemoveJid === botJid) {
                throw new DangerError("Você não pode me remover!");
            }
            
            const groupMetaData = (await bot.groupMetadata(remoteJid));
            let imageBuffer;

            await sendWaitReply();
            await sendSuccessReact();
            try {
                const image = await bot.profilePictureUrl(memberToRemoveJid, "image");
                imageBuffer = await getBuffer(image);
                await bot.sendMessage(remoteJid, 
                    { image: imageBuffer, caption: `O membro @${memberToRemoveNumber} foi removido do grupo ${groupMetaData.subject}`, mentions: [memberToRemoveJid]},
                    { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
                );
            } catch (error) {
                console.error(error);
                imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
                await bot.sendMessage(remoteJid, 
                    { image: { url: imageBuffer }, caption: `O membro @${memberToRemoveNumber} foi removido do grupo ${groupMetaData.subject}`, mentions: [memberToRemoveJid] },
                    { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
                );
            }

            await bot.groupParticipantsUpdate(remoteJid, [memberToRemoveJid], "remove");
        } catch(error) {
            console.log(error);
            throw new Error(error);
        } 
    },
};
