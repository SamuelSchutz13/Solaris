const { cpf } = require("cpf-cnpj-validator");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "cpf",
    description: "Irei gerar CPF para você",
    commands: ["cpf"],
    usage: `${getRandomPrefix()}cpf`,
    handle: async ({
        sendWaitReply,
        sendSuccessReact, 
        sendSuccessReply,
    }) => {

        const CPF = cpf.generate();

        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`
*CPF:* ${cpf.format(CPF)}
*Validade:* ${cpf.isValid(CPF) ? "Válido" : "Inválido"}
        `)
    },
};
