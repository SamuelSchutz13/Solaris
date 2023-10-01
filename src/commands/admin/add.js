const { BOT_NUMBER, IMAGES_DIR } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { getRandomPrefix } = require("../../services/prefixService");
const { getBuffer } = require("../../services/imageService");
const path = require("path");

module.exports = {
    name: "adicionar",
    description: "Adicionarei um membro do grupo",
    commands: ["add", "adicionar"],
    usage: `${getRandomPrefix()}add @marcar_membro ou ${getRandomPrefix()}add (mencionando uma mensagem)`,
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

            const memberToAddJid = isReply ? replyJid : toUserJid(args[0]);
            const memberToAddNumber = onlyNumbers(memberToAddJid);

            if(memberToAddNumber.length < 7 || memberToAddNumber.length > 15) {
                throw new InvalidParameterError("Número inválido!");
            }

            if(memberToAddJid === userJid) {
                throw new DangerError("Você não pode adicionar você mesmo!");
            }

            const botJid = toUserJid(BOT_NUMBER);

            if(memberToAddJid === botJid) {
                throw new DangerError("Você não pode me adicionar!");
            }

            const groupMetaData = (await bot.groupMetadata(remoteJid));
            let imageBuffer;

            await sendWaitReply();
            await sendSuccessReact();
            try {
                const image = await bot.profilePictureUrl(memberToAddJid, "image");
                imageBuffer = await getBuffer(image);
                await bot.sendMessage(remoteJid, 
                    { image: imageBuffer, caption: `O membro @${memberToAddNumber} foi adicionado ao grupo ${groupMetaData.subject}`, mentions: [memberToAddJid]},
                    { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
                );
            } catch (error) {
                console.error(error);
                imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
                await bot.sendMessage(remoteJid, 
                    { image: { url: imageBuffer }, caption: `O membro @${memberToAddNumber} foi adicionado ao grupo ${groupMetaData.subject}`, mentions: [memberToAddJid] },
                    { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
                );
            }

            await bot.groupParticipantsUpdate(remoteJid, [memberToAddJid], "add");
        } catch(error) {
            console.log(error);
            throw new Error(error);
        } 
    },
};
