const morse = require('morse-node').create("ITU");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "morseDecode",
    description: "Descodifica uma mensagem em morse",	
    commands: ["morseDecode", "morse-decode", "morsed"],
    usage: `${getRandomPrefix()}morseDecode <mensagem>`,
    handle: async ({
        sendSuccessReact, 
        sendSuccessReply, 
        sendWaitReply, 
        baileysMessage,  
    }) => {
        const morseTextdecoded = morse.decode(baileysMessage?.message?.conversation, 13);
        console.log(morseTextdecoded)

        await sendWaitReply(); 
        await sendSuccessReact();
        await sendSuccessReply(`Código Morse Convertido: ${morseTextdecoded}`);
    },
};
