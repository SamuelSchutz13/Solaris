const { getRandomPrefix } = require("../../services/prefixService");

module.exports = {
    name: "personalizedChance",
    description: "Chance de algo",
    commands: ["personalizedChance", "chance-personalizada", "chancepersonalizada"],
    usage: `${getRandomPrefix()}personalizedChance ganhar na mega sena`,
    handle: async ({ 
        sendSuccessReply, 
        sendWaitReply, 
        sendSuccessReact, 
        args, 
    }) => {
        const percent = Math.floor(Math.random() * 100) + 1;
        
        await sendWaitReply();
        await sendSuccessReact();
        await sendSuccessReply(`As chances de *${args}* é de *${percent}%* `);
    }
}
