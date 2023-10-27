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

        if (!args[0]) {
            await sendWarningReact();
            await sendWarningReply("Você precisa informar o que deseja saber o top3");
            return;
        }

        const topMembers = getRandomTop3(participants, BOT_NUMBER); 

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

function getRandomTop3(participants, excludeNumber) {
    const randomIndices = [];
    while (randomIndices.length < 3) {
        const randomIndex = getRandomIndex(participants, randomIndices);
        if (participants[randomIndex].jid !== excludeNumber) {
            randomIndices.push(randomIndex);
        }
    }
    return randomIndices.map(index => participants[index]);
}
