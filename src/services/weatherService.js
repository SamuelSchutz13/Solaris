export function getCurrentTime() {
    return new Date().getHours();
}

function getWeatherEmoji(weather, isDay) {
    const weatherEmojiMap = {
        'Clear': isDay ? '☀️' : '🌕',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Mist': '🌬️',
        'Thunderstorm': '⛈️',
        'ShowerRain': '🌨️',
        'FewClouds': '🌥️',
    };

    return weatherEmojiMap[weather] || '';
}
    
module.exports = getWeatherEmoji;