const { OPENWEATHER_API_KEY } = require("../../config");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "openWeather",
    description: "Consulta de Previsão do Tempo",
    commands: ["weather", "tempo"],
    usage: `${getRandomPrefix()}weather São Paulo`,
    handle: async ({
        sendWarningReply, 
        bot,
        remoteJid,
        sendWarningReact,
        sendSuccessReact, 
        sendWaitReply, 
        args, 
    }) => {
        const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${args}&units=metric&appid=${OPENWEATHER_API_KEY}&lang=pt_br`).then(response => response.json());

        if (!args && !args[0]) {
            await sendWarningReact();
            await sendWarningReply("Cidade não encontrada!");
            return;
        }

        await sendWaitReply();
        await sendSuccessReact();
        await bot.sendMessage(remoteJid, 
            { caption: 
`
*Cidade:* ${data.name}, ${data.sys.country}
*Tempo:* ${data.weather[0].main} | ${data.weather[0].description}
*Temperatura:* ${data.main.temp}°C
*Temperatura Máxima:* ${data.main.temp_max}°C
*Temperatura Minima:* ${data.main.temp_min}°C
*Humidade:* ${data.main.humidity}%
*Vento:* ${data.wind.speed}km/h             
            `}
        )

    
    },
};
