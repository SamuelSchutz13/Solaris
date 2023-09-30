const { NEWS_API_KEY } = require("../../config");
const axios = require("axios");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "news",
    description: "Veja notícias no bot",
    commands: ["news", "noticias"],
    usage: `${getRandomPrefix()}news <termo de pesquisa>`,
    handle: async ({
        sendSuccessReact,
        sendWarningReply,
        sendWarningReact,
        sendWaitReply,
        remoteJid,
        args,
        bot,
    }) => {
        if (!args) {
            await sendWarningReact();
            await sendWarningReply("Por favor, forneça um termo de pesquisa para as notícias");
            return;
        }

        const newsApi = axios.create({
            baseURL: "https://newsapi.org/v2",
            headers: {
                Authorization: `Bearer ${NEWS_API_KEY}`,
            },
        });

        const fetchNews = async () => {
            const { data } = await newsApi.get("/everything", {
                params: {
                    q: args.join(" "),
                    language: 'pt',
                    pageSize: 3,
                },
            });

            return data;
        };

        const newsData = await fetchNews();

        if (!newsData?.articles?.length) {
            await sendWarningReply("Nenhuma notícia encontrada para o termo de pesquisa fornecido");
            return;
        }

        const sortedArticles = (newsData?.articles).filter(
            article => article?.title !== '[Removed]'
        );
            
        await sendWaitReply();
        await sendSuccessReact();
        
        for (const article of sortedArticles) {
            const imageUrl = article?.urlToImage;
            
            const captionUrl = `
*${article.title}*
Fonte: ${article.source.name}
${new Date(article.publishedAt).toLocaleDateString("pt-br")} às ${new Date(article.publishedAt).toLocaleTimeString("pt-br")}
*Leia mais:* ${article.url}`;

            await bot.sendMessage(remoteJid, {
                image: { url: imageUrl }, 
                caption: captionUrl,
            });
        };
    },
};
