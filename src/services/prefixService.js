const { PREFIX1, PREFIX2, PREFIX3, PREFIX4 } = require("../config");

function getRandomPrefix()  {
    const prefixes = [PREFIX1, PREFIX2, PREFIX3, PREFIX4];
    const randomIndex = Math.floor(Math.random() * prefixes.length);
    return prefixes[randomIndex];
};

module.exports = { getRandomPrefix };
