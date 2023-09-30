const { getRandomPrefix } = require("../../services/prefixService");
const { mentionUser } = require("../../services/mentionService");


module.exports = {
    name: "couple",
    description: "Irá formar um casal entre os membros do grupo",
    commands: ["couple", "casal"],
    usage: `${getRandomPrefix()}couple`,
    handle: async ({
        sendSuccessReact, 
        sendWarningReact, 
        sendWarningReply,
        sendWaitReply, 
        remoteJid, 
        bot, 
    }) => {
        const metadata = await bot.groupMetadata(remoteJid);
        const participants = metadata.participants;

        if (participants.length < 2) {
            await sendWarningReact();
            await sendWarningReply("Não há participantes suficientes para formar um casal");
            return;
        }

        const randomCouple = getRandomCouple(participants);

        const coupleText = `Casal formado no grupo ${metadata.subject} o amor está no ar entre eles:
${mentionUser(randomCouple[0])} e ${mentionUser(randomCouple[1])} `;

        await sendWaitReply();
        await sendSuccessReact();
        await bot.sendMessage(remoteJid, {text: coupleText, mentions: randomCouple.map(user => user.id) });
    },
};

function getRandomCouple(participants) {
    const randomIndex1 = Math.floor(Math.random() * participants.length);
    let randomIndex2 = Math.floor(Math.random() * participants.length);

    while (randomIndex2 === randomIndex1) {
        randomIndex2 = Math.floor(Math.random() * participants.length);
    }

    return [participants[randomIndex1], participants[randomIndex2]];
}
