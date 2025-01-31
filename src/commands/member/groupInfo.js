const { IMAGES_DIR, JSON_DIR } = require("../../config");
const { toUserJid, onlyNumbers } = require("../../utils");
const { getRandomPrefix } = require("../../services/prefixService");
const { getBuffer } = require("../../services/imageService");
const { getGroupPremiumStatus } = require("../../services/premiumService");
const path = require("path");
const fs = require("fs");

module.exports = {
    name: "groupInfo",
    description: "Consulta algumas informações do grupo",
    commands: ["groupInfo", "groupInfo", "groupinfo"],
    usage: `${getRandomPrefix()}group`,
    handle: async ({
        sendSuccessReact,
        baileysMessage,
        sendWaitReply,
        remoteJid,
        bot,
    }) => {
        const date = new Date();
        const memberToNameJid = toUserJid(baileysMessage?.key?.participant);
        const memberNameNumber = onlyNumbers(memberToNameJid);
        const groupMetadata = (await bot.groupMetadata(remoteJid));
        const groupJsonPath = `${JSON_DIR}/group/${remoteJid}.json`;
        let groupPremium = false;

        try {
            if (fs.existsSync(groupJsonPath)) {
                const jsonData = fs.readFileSync(groupJsonPath, 'utf-8');
                const data = JSON.parse(jsonData);
                if (data.premium) {
                    groupPremium = data.premium;
                }
            }
        } catch (error) {
            console.error(error);
        }

        const groupInfos = (`
╭─「@${memberNameNumber} | ${groupPremium ? "🅿️" : ""}」
│ 
│─ *Grupo:* ${groupMetadata?.subject}
│─ *Integrantes:* ${groupMetadata?.participants?.length}
│─ *Premium:* ${getGroupPremiumStatus(remoteJid)}
│
╰─「${date.toLocaleDateString("pt-br")} às ${date.toLocaleTimeString("pt-br")}」
        `);

        let imageBuffer;

        await sendWaitReply();
        await sendSuccessReact();
        try {
            const image = await bot.profilePictureUrl(remoteJid, "image");
            imageBuffer = await getBuffer(image);
            await bot.sendMessage(remoteJid,
                { image: imageBuffer, caption: groupInfos, mentions: [memberToNameJid]  },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        } catch (error) {
            console.error(error);
            imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
            await bot.sendMessage(remoteJid,
                { image: { url: imageBuffer }, caption: groupInfos, mentions: [memberToNameJid]  },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        }
    },
};
