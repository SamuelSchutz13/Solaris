const { OPENWEATHER_API_KEY } = require("../../config");
const { getRandomPrefix } = require("../../services/prefixService");
const { getWeatherEmoji } = require("../../services/weatherService");

module.exports = {
    name: "openWeather",
    description: "Consulta de Previsão do Tempo",
    commands: ["weather", "tempo"],
    usage: `${getRandomPrefix()}weather São Paulo`,
    handle: async ({
        sendSuccessReply, 
        sendWarningReply, 
        sendSuccessReact,
        sendWarningReact,
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

        const weatherEmoji = getWeatherEmoji(data.weather[0].main);

        await sendSuccessReply(`
*Cidade:* ${data.name}, ${data.sys.country}
*Tempo:* ${weatherEmoji} - _${data.weather[0].description}_
*Temperatura:* ${data.main.temp}°C
    _Máxima:_ ${data.main.temp_max}°C
    _Minima:_ ${data.main.temp_min}°C
*Humidade:* ${data.main.humidity}%
*Vento:* ${data.wind.speed}km/h     
        `);

    },
};

