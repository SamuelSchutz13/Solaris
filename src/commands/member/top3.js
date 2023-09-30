const { getRandomPrefix } = require("../../services/prefixService");
const { mentionUser } = require("../../services/mentionService");

module.exports = {
    name: "top3",
    description: "Top3 membros alguma coisa do grupo",
    commands: ["top3"],
    usage: `${getRandomPrefix()}top3 <mensagem>`,
    handle: async ({
        sendWarningReact, 
        sendWarningReply, 
        sendSuccessReact, 
        sendWaitReply,
        remoteJid, 
        bot, 
        args,
    }) => {
        const metadata = await bot.groupMetadata(remoteJid);
        const participants = metadata.participants;

        if (participants.length < 2) {
            await sendWarningReact();
            await sendWarningReply("Não há participantes suficientes para formar o top3");
            return;
        }

        if(!args) {
            await sendWarningReact();
            await sendWarningReply("Você precisa informar o que deseja saber o top3");
        }

        const topMembers = getRandomTop3(participants);
        const top3Args = args[0].toLowerCase(); 

            const top3Text = `Top3 membros *${top3Args}* do grupo ${metadata.subject}:
1 - 🥇. ${mentionUser(topMembers[0])}
2 - 🥈. ${mentionUser(topMembers[1])}
3 - 🥉. ${mentionUser(topMembers[2])}`;

        await sendWaitReply();
        await sendSuccessReact();
        await bot.sendMessage(remoteJid, {text: top3Text, mentions: topMembers.map(user => user.id) });
    },
};

function getRandomTop3(participants) {
    const randomIndex1 = Math.floor(Math.random() * participants.length);
    let randomIndex2 = Math.floor(Math.random() * participants.length);
    let randomIndex3 = Math.floor(Math.random() * participants.length);

    while(randomIndex1 === randomIndex2) {
        randomIndex1 = Math.floor(Math.random() * participants.length);
    }

    while(randomIndex2 === randomIndex3) {
        randomIndex2 = Math.floor(Math.random() * participants.length);
    }

    while(randomIndex1 === randomIndex3) {
        randomIndex3 = Math.floor(Math.random() * participants.length);
    }

    return [participants[randomIndex1], participants[randomIndex2], participants[randomIndex3]];
}
