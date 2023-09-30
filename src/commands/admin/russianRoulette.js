const { BOT_NUMBER, IMAGES_DIR } = require("../../config");
const { DangerError } = require("../../errors/DangerError");
const { toUserJid, onlyNumbers } = require("../../utils");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "russianRoulette",
    description: "Roleta russa irá banindo algum membro",
    commands: ["russianRoulette", "roletarussa", "roletaRussa"],
    usage: `${getRandomPrefix()}russianRoulette`,
    handle: async ({
        bot,
        remoteJid, 
        sendWaitReply,
        sendSuccessReact,
    }) => {
        const participantsGroup = (await bot.groupMetadata(remoteJid)).participants;
        let arrayParticipantes = participantsGroup.map((participant) => participant.id);
        const randomMemberJid = arrayParticipantes[Math.round(Math.random() * arrayParticipantes.length)];
        const randomMemberNumber = onlyNumbers(randomMemberJid);

        const botJid = toUserJid(BOT_NUMBER);
        if(randomMemberJid === botJid) {
            throw new DangerError("Não posso ser removido!");
        }

        const groupMetadata = (await bot.groupMetadata(remoteJid));

        await sendWaitReply();
        await sendSuccessReact();
        await bot.sendMessage(remoteJid, 
            { image: {url: `${IMAGES_DIR}/ejected.jpg`}, caption: `
            . 🌍     　。　　　　•　    　ﾟ　　。
    　　.　　　.　　　  　　.　　　　　。　　   。　.
    　.　　      。　        ඞ   。　    .    •
    •   .  @${randomMemberNumber} was 
ejected from  ${groupMetadata.subject}  .
        🪐              .    •
    '              。　.                       °
    　 　　。　　 　　　　ﾟ　　　.　      　　　.
        　　　　.  🚀      *          .
        ` , mentions: [randomMemberJid]});

        await bot.groupParticipantsUpdate(remoteJid, [randomMemberJid], "remove");
    },
};
