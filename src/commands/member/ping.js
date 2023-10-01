const { getRandomPrefix } = require("../../services/prefixService");

let botStartTime = new Date().getTime(); 

module.exports = {
    name: "ping",
    description: "Verifica se o bot está online",
    commands: ["ping"],
    usage: `${getRandomPrefix()}ping`,
    handle: async ({
        sendWaitReply,
        sendReply, 
        sendReact,
    }) => {
        const pingStart = new Date().getTime();

        const easterEgg = Math.random();
        const probabilityEasterEgg = 0.001;

        await sendReact(easterEgg < probabilityEasterEgg ? "🍳" : "🏓");

        const pingTime = new Date().getTime() - pingStart;
        const formattedPingTime = formatPingTime(pingTime);

        const currentTime = new Date().getTime();
        const uptimeInSeconds = Math.floor((currentTime - botStartTime) / 1000); 
        const upTime = formatUptime(uptimeInSeconds);

        const pingInfos = (`
*⏱️ Ativo Por:* ${upTime}
*📡 Tempo de Resposta:* ${formattedPingTime}
        `);

        await sendWaitReply();
        await sendReply(easterEgg < probabilityEasterEgg ? `🍳Pong!...Splahh! a bolinha quebrou ${pingInfos}` : `🏓Pong! ${pingInfos}`)
    },
};

function formatPingTime(pingTime) {
    if (pingTime < 1) {
        return `${(pingTime * 1000).toFixed(3)}s`;
    } else {
        return `${(pingTime / 1000).toFixed(3)}ms`;
    }
}

function formatUptime(uptimeInSeconds) {
    const days = Math.floor(uptimeInSeconds / 86400);
    const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = uptimeInSeconds % 60;

    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    
    return uptimeString;
}
