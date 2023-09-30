const { cnpj } = require("cpf-cnpj-validator");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "cnpj",
    description: "Irei gerar CNPJ para você!",
    commands: ["cnpj"],
    usage: `${getRandomPrefix()}cnpj`,
    handle: async ({
        sendWaitReply,
        sendSuccessReact, 
        sendSuccessReply,
    }) => {

        const CNPJ = cnpj.generate();

        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`
        
*CNPJ:* ${cnpj.format(CNPJ)}
*Validade:* ${cnpj.isValid(CNPJ) ? "Válido" : "Inválido"}
        `);
    },
};
