const yts = require('yt-search');
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "youtubeSearch",
    description: "Pesquisa algo do YouTube usando o Bot",
    commands: ["yts","yt-search", "youtube-pesquisa"],
    usage: `${getRandomPrefix()}youtubeSearch`,
    handle: async ({
        sendSuccessReact,
        sendWarningReact,
        sendWarningReply,
        sendWaitReply,
        remoteJid, 
        args,
        bot,
    }) => {
        if (!args[0]) {
            await sendWarningReact();
            await sendWarningReply("Por favor, forneça algo que deseje pesquisa no YouTube");
            return;
        }

        const search = await yts(args.join(' '));
        const videos = search.videos.slice(0, 3);

        await sendWaitReply();
        await sendSuccessReact();
        videos.forEach(async (yt) => {
            const videosSearch =`
*${yt.title}*
Canal: ${yt.author.name} - ${yt.ago}
Duração: ${yt.timestamp} 
Visualizações: ${formatNumber(yt.views)}
*Link do Vídeo:* ${yt.url}
*Link do Canal:* ${yt.author.url}
                `

            await bot.sendMessage(remoteJid, {
                image: { url: yt.thumbnail }, 
                caption: videosSearch,
            });
        });
    },
};

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
