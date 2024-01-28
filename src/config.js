const path = require("path");

exports.PREFIX1 = "$";
exports.PREFIX2 = "#";
exports.PREFIX3 = "/";
exports.PREFIX4 = "!";

exports.BOT_EMOJI = "🤖";
exports.BOT_VERSION = "1.0.2";
exports.BOT_NAME = "Solaris Bot";
exports.BOT_NUMBER = "";

exports.DEV_ID = "";
exports.PIX_KEY="";    
exports.DEV_NAME = "";

exports.COMMANDS_DIR = path.join(__dirname, "commands");
exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");
exports.AUDIOS_DIR = path.resolve(__dirname, "..", "assets", "audios");
exports.IMAGES_DIR = path.resolve(__dirname, "..", "assets", "images");
exports.JSON_DIR = path.resolve(__dirname, "..", "assets", "json");

exports.TIMEOUT_IN_MILLISECONDS_BY_EVENT = 700;

exports.PAGES = 10; 
exports.COINS_COST = 5;

exports.GPT_API_KEY = "";
exports.OPENWEATHER_API_KEY = "";
exports.NEWS_API_KEY="";
exports.API_PRO_KEY="";
exports.STICKER_API_KEY="; 
