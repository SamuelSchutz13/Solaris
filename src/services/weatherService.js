export function getWeatherEmoji(weather, currentTime) {
    const weatherEmojiMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Mist': '🌬️',
        'Thunderstorm': '⛈️',
        'ShowerRain': '🌨️',
        'FewClouds': '🌥️',
    };

    const isMorningOrAfternoon = currentTime >= 6 && currentTime < 18;
    const isClear = weather === 'Clear';
    const weatherEmoji = isClear && !isMorningOrAfternoon ? '🌕' : weatherEmojiMap[weather] || '';
    
    return weatherEmoji;
}
