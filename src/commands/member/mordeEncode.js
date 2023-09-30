const morse = require('morse-node').create("ITU");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "morseEncode",
    description: "Codifica uma mensagem em morse",	
    commands: ["morseEncode", "morse-encode", "morsee"],
    usage: `${getRandomPrefix()}morseEncode <mensagem>`,
    handle: async ({
        sendSuccessReact, 
        sendSuccessReply, 
        sendWaitReply, 
        baileysMessage,  
    }) => {
        const morseTextEncoded = morse.encode(baileysMessage?.message?.conversation, 13);

        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`Código Morse: ${morseTextEncoded}`);
    },
};
