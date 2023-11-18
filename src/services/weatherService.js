function getCurrentTime() {
    return new Date().getHours();
}

function getWeatherEmoji(weather, isDay) {
    const weatherEmojiMap = {
        'BrokenClouds': '🌫️',
        'Clear': isDay ? '☀️' : '🌕',
        'Clouds': '☁️',
        'FewClouds': '🌥️',
        'Mist': '🌪️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'ShowerRain': '🌨️',
        'Thunderstorm': '⛈️',
    };

    return weatherEmojiMap[weather] || '❔';
}
    
module.exports = {
    getCurrentTime,
    getWeatherEmoji
};