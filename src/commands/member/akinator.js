const { Aki } = require("aki-api");
const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "akinator",
    description: "Jogue akinator com o bot",
    commands: ["aki", "akinator"],
    usage: `${getRandomPrefix()}akinator`,
    handle: async ({
        sendWaitReply,
        sendSuccessReact, 
        remoteJid,
        textMessage,
        sendReply,
        bot,
    }) => {
        const aki = new Aki({
            region: "pt",
        });
        
        await sendWaitReply();
        await sendSuccessReact();
        await aki.start();
        await sendReply(`*Bem Vindo ao Akinator* Responda as perguntas com: sim, não e não sei`);

        while(aki.question !== null) {
            await sendReply(aki.question);

            if(textMessage === 's' || 'sim') {
                await aki.step(0);
            } else if(textMessage === 'n' || 'não' || 'nao') {
                await aki.step(1);
            } else if(textMessage === 'ns' || 'não sei' || 'nao sei') {
                await aki.step(2);
            } else {
                await sendReply(`Resposta Invalida, Responda com: sim, não ou não sei`);
                continue;
            }

            if(aki.progress >= 80 || aki.currentStep >= 78) {
                const character = (await aki.win()).guesses[0].name;
                const profile_image = (await aki.win()).guesses[0].absolute_picture_path;

                await bot.sendMessage(remoteJid, 
                   {image: {url: profile_image }, caption: `Akinator acha que o personagem é *${character}*`});
                break;
            }
        }
    },
};