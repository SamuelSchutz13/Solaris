const { IMAGES_DIR, JSON_DIR } = require("../../config");
const { toUserJid, onlyNumbers } = require("../../utils");
const { getRandomPrefix } = require("../../services/prefixService");
const { getBuffer } = require("../../services/imageService");
const { getUserPremiumStatus } = require("../../services/premiumService");
const path = require("path");
const fs = require("fs");

module.exports = {
    name: "user",
    description: "Consulta algumas informações do usuário",
    commands: ["user", "usuario"],
    usage: `${getRandomPrefix()}user`,
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
        const userRole = (await bot.groupMetadata(remoteJid)).participants;
        const participant = userRole.find((participant) => participant.id === memberToNameJid);
        const groupMetadata = (await bot.groupMetadata(remoteJid));

        const userJsonPath = `${JSON_DIR}/user/${memberNameNumber}.json`;
        let userPremium = false;
        let userCoins = 0;
        let userSurname = baileysMessage?.pushName;

        try {
            if (fs.existsSync(userJsonPath)) {
                const jsonData = fs.readFileSync(userJsonPath, 'utf-8');
                const data = JSON.parse(jsonData);
                if (data.premium) {
                    userPremium = data.premium;
                }

                if (data.coins) {
                    userCoins = data.coins; 
                }

                if (data.surname) {
                    userSurname = data.surname; 
                } else {
                    userSurname = baileysMessage?.pushName; 
                }
            }
        } catch (error) {
            console.error(error);
        }

        const roleMapping = {
            superadmin: 'Criador',
            admin: 'Administrador',
        };

        const participantRole = roleMapping[participant.admin] || "Membro";

        const formatCoins = (coins) => {
            return coins.toLocaleString('pt-BR');
        };

        const formattedCoins = formatCoins(userCoins);

        const userInfos = (`
╭─「@${memberNameNumber} | ${userPremium ? "🅿️" : ""}」
│ 
│─ *Apelido:* ${userSurname}  
│─ *Telefone:* +${memberNameNumber}
│─ *Grupo*: ${groupMetadata?.subject}
│─ *Cargo no Grupo:* ${participantRole}
│─ *Premium:* ${getUserPremiumStatus(memberToNameJid)}
│─ *Solarcoins:* ${formattedCoins}
│
╰─「${date.toLocaleDateString("pt-br")} às ${date.toLocaleTimeString("pt-br")}」
        `);

        let imageBuffer;

        await sendWaitReply();
        await sendSuccessReact();
        try {
            const image = await bot.profilePictureUrl(memberToNameJid, "image");
            imageBuffer = await getBuffer(image);
            await bot.sendMessage(remoteJid,
                { image: imageBuffer, caption: userInfos, mentions: [memberToNameJid] },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        } catch (error) {
            console.error(error);
            imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
            await bot.sendMessage(remoteJid,
                { image: { url: imageBuffer }, caption: userInfos, mentions: [memberToNameJid] },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        }
    },
};
