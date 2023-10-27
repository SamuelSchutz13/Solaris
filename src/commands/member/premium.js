const { BOT_NAME, DEV_NAME, PIX_KEY } = require("../../config");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "premium",
    description: "saiba mais sobre o Premium",
    commands: ["premium"],
    usage: `${getRandomPrefix()}premium`,
    handle: async ({
        sendWaitReply,
        sendSuccessReact,
        sendSuccessReply,
    }) => { 
        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`*Premium* - ${BOT_NAME}
        
*Como comprar?* 
_Basta fazer um pix para o desenvolvedor ${DEV_NAME}, no qual irá ativar o premium ao seu usuário em um prazo de até 1 hora após o envio do comprovante._

*Premium Grupo?* 
_Você pode comprar o acesso premium por *R$29,90*. Ao comprar o premium, você pode utilizar comandos pagos por 1 mês._

*Premium Usuário?* 
_Você pode comprar o acesso premium por *R$9,90*. Ao comprar o premium, o grupo pode utilizar comandos pagos por 1 mês._

*Solarcoins?*
_Os comandos premium poderão ser utilizados com Colarcoins, que podem ser adquiridos através dos games ou comprando._
*Obs:* _Cada comando premium custa ₹5 Solarcoin, e cada Solarcoin custa 1 Centavo._

*Pix* - _Chave Aleatória_
${PIX_KEY}
        `);
    },
};