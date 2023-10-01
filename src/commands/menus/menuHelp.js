const { PREFIX1, PREFIX2, PREFIX3, BOT_NAME, DEV_NAME, AUDIOS_DIR, IMAGES_DIR, BOT_VERSION } = require("../../config");
const { getBuffer } = require("../../services/imageService");
const { getRandomPrefix } = require("../../services/prefixService");
const path = require("path");

module.exports = {
    name: "help",
    description: "Descrição dos Comandos",
    commands: ["help", "ajuda"],
    usage: `${getRandomPrefix()}help`,
    handle: async ({
        sendAudioFromFile,
        baileysMessage,
        sendReact,  
        remoteJid,
        bot,  
    }) => {
        const date = new Date();
        const groupMeta = (await bot.groupMetadata(remoteJid));
        const dateGroupCreated = new Date(groupMeta.creation * 1000).toLocaleDateString("pt-br");
        let imageBuffer;

        await sendReact('🌌');
        const menuHelp = (`
╭━━⪩ *${BOT_NAME}* ⪨━━
▢
▢ • *Grupo:* ${groupMeta.subject}
▢ • *Integrantes:* ${groupMeta.size}
▢ • *Data de Criação:* ${dateGroupCreated}
▢ • *Data de Hoje:* ${date.toLocaleDateString("pt-br")}
▢ • *Horário:* ${date.toLocaleTimeString("pt-br")}
▢ • *Prefixo de Comandos:* ${PREFIX1} ${PREFIX2} ${PREFIX3}
▢
▢ • ★ = Comandos _Premium_
▢
╰━━─「🪐」─━━

╭━━⪩ *Comandos de Administradores* ⪨━━
▢
▢ *Add?*
▢ Adiciona um membro no grupo
▢ Uso: ${getRandomPrefix()}add mencionar a mensagem
▢
▢ *AddPicture?*
▢ Adiciona uma foto ao grupo
▢ Uso: ${getRandomPrefix()}addPicture (marque a imagem)
▢
▢ *Ban?*
▢ Bane um membro do grupo
▢ Uso: ${getRandomPrefix()}ban @marcar o membro
▢
▢ *Demote?*
▢ Tira o ADM de um membro
▢ Uso: ${getRandomPrefix()}demote @marque a pessoa
▢
▢ *DescriptionGroup?*
▢ Altera a descrição do grupo
▢ Uso: ${getRandomPrefix()}descriptionGroup Nome Descrição
▢
▢ *LinkGroup?*
▢ Pega o link de convite do grupo
▢ Uso: ${getRandomPrefix()}linkGroup
▢
▢ *MentionAll?*
▢ Menciona todos os membros do grupo
▢ Uso: ${getRandomPrefix()}mentionAll
▢
▢ *Mute?*
▢ Fecha o grupo apenas para administradores
▢ Uso: ${getRandomPrefix()}mute
▢
▢ *Promote?*
▢ Promove um membro a ADM
▢ Uso: ${getRandomPrefix()}promote @marque a pessoa
▢
▢ *RemovePicture?*
▢ Remove a foto do grupo
▢ Uso: ${getRandomPrefix()}removePicture
▢
▢ *RevokeGroupCode?*
▢ Gera um novo link de convite do grupo
▢ Uso: ${getRandomPrefix()}revokeGroupCode
▢
▢ *RussianRoulette?*
▢ Escolhe um membro aleatório do grupo
▢ Uso: ${getRandomPrefix()}russianRoulette
▢
▢ *Surname?*
▢ Adiciona um apelido no membro desejado
▢ Uso: ${getRandomPrefix()}surname <apelido>
▢
▢ *TitleGroup?*
▢ Altera o nome do grupo
▢ Uso: ${getRandomPrefix()}titleGroup Nome Grupo
▢
▢ *Unmute?*
▢ Abre o grupo para todos os membros
▢ Uso: ${getRandomPrefix()}unmute
▢ 
╰━━─「⭐」─━━

╭━━⪩ *Comandos de Membros* ⪨━━
▢
▢ *CEP?*
▢ Consulta de cidade por CEP
▢ Uso: ${getRandomPrefix()}cep 01001-001
▢
▢ *Clear?*
▢ Limpa a tela do Grupo
▢ Uso: ${getRandomPrefix()}clear
▢
▢ *Check?*
▢ Checkin diário para obter Solarcoins
▢ Uso: ${getRandomPrefix()}check 
▢  
▢ *CNPJ?*
▢ Gera um CNPJ aleatório
▢ Uso: ${getRandomPrefix()}cnpj
▢
▢ *CopyPaste-list?*
▢ Lista todas as pastas do copypaste
▢ Uso: ${getRandomPrefix()}copypaste-list <número da página>
▢
▢ *CopyPaste-search?*
▢ Procura uma pasta no copypaste
▢ Uso: ${getRandomPrefix()}copypaste-search <número da pasta>
▢
▢ *Couple?*
▢ Forma um casal aleatório no grupo
▢ Uso: ${getRandomPrefix()}casal
▢
▢ *CPF?*
▢ Gera um CPF aleatório
▢ Uso: ${getRandomPrefix()}cpf   
▢ *MorseDecode?*
▢ Descodifica uma mensagem em morse
▢ Uso: ${getRandomPrefix()}morse-decode <mensagem>
▢
▢ *MorseEncode?*
▢ Codifica uma mensagem em morse
▢ Uso: ${getRandomPrefix()}morse-encode <mensagem>
▢
▢ *PersonalizedChance?*
▢ Mostra as chances de algo
▢ Uso: ${getRandomPrefix()}chance-personalizada <mensagem>
▢
▢ *Sticker?*
▢ Mandando uma imagem = Transforma uma imagem em sticker
▢ Uso: ${getRandomPrefix()}sticker (marque a imagem/gif/video) 
▢ ou ${getRandomPrefix()}sticker (responda a imagem/gif/video) 
▢
▢ *Sticker-Emoji?*
▢ Transforma emoji em sticker
▢ Uso: ${getRandomPrefix()}sticker-emoji 🤖
▢
▢ *Top3?*
▢ Mostra o top3 de alguma coisa no grupo
▢ Uso: ${getRandomPrefix()}top3 <mensagem>
▢
▢ *Toimg?*
▢ Transforma um sticker em imagem
▢ Uso: ${getRandomPrefix()}toimage (marque a figurinha)
▢
▢ *TTS?*
▢ Transforma um texto em áudio
▢ Uso: ${getRandomPrefix()}tts <linguage> <mensagem>
▢
▢ *User?*
▢ Consulta o usuário
▢ Uso: ${getRandomPrefix()}user 
▢
▢ *Username?*
▢ Gera um usuário aleatório
▢ Uso: ${getRandomPrefix()}username
▢
▢ *Wame?*
▢ Gera um link do seu número
▢ Uso: ${getRandomPrefix()}wame
▢
╰━━─「🌕」─━━

╭━━⪩ *Comandos de Membros _Premium_* ⪨━━
▢
★ *CopyPaste-add?*
▢ Adiciona uma nova pasta ao copypaste
▢ Uso: ${getRandomPrefix()}copypaste-add <titulo> <mensagem>
▢
★ *CopyPaste-remove?*
▢ Remove uma pasta do copypaste
▢ Uso: ${getRandomPrefix()}copypaste-remove <número da pasta>
▢
★ *News?*
▢ Veja alguma notícia no bot
▢ Uso: ${getRandomPrefix()}news <mensagem>
▢
★ *Weather?*
▢ Consulta o clima de uma cidade
▢ Uso: ${getRandomPrefix()}weather São Paulo
▢
★ *YouTubeSeach?*
▢ Pesquisa algo no YouTube
▢ Uso: ${getRandomPrefix()}youtube-pesquisa <mensagem>
▢
╰━━─「💫」─━━

╭━━⪩ *Comandos de Jogos* ⪨━━
▢
▢ *Akinator?*
▢ Jogue Akinator no bot
▢ Uso: ${getRandomPrefix()}akinator
▢
▢ *SlotMachine?*
▢ Gire o caça-níquel no bot
▢ Uso: ${getRandomPrefix()}slotMachine
▢
╰━━─「🕹️」─━━

╭━━⪩ *Comandos do Grupo* ⪨━━
▢
▢ *GetTitle?*
▢ Mostra o nome do Grupo
▢ Uso: ${getRandomPrefix()}getTitle
▢
▢ *GetDesc?*
▢ Mostra a descrição do Grupo
▢ Uso: ${getRandomPrefix()}getDesc
▢
▢ *GetPicture?*
▢ Mostra a foto do Grupo
▢ Uso: ${getRandomPrefix()}getPicture
▢
╰━━─「🌎」─━━

╭━━⪩ *Comandos do Bot* ⪨━━
▢
▢ *Menu?*
▢ Mostra o menu de comandos
▢ Uso: ${getRandomPrefix()}menu 
▢
▢ *Ping?*
▢ Mostra informações do bot
▢ Uso: ${getRandomPrefix()}ping
▢
▢ *Premium?*
▢ Mostra informações sobre o premium
▢ Uso: ${getRandomPrefix()}premium
▢ 
╰━━─「🛸」─━━

╭━━⪩ *Descrição* ⪨━━
▢
▢ • *Desenvolvedor:* ${DEV_NAME}
▢ • *Versão:* ${BOT_VERSION}
▢
╰━━─「🌕」─━━
        `)

        try {
            const image = await bot.profilePictureUrl(remoteJid, "image");
            imageBuffer = await getBuffer(image);
            await bot.sendMessage(remoteJid, 
                { image: imageBuffer, caption: menuHelp },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        } catch (error) {
            console.error(error);
            imageBuffer = await path.resolve(`${IMAGES_DIR}/default.jpg`);
            await bot.sendMessage(remoteJid, 
                { image: { url: imageBuffer }, caption: menuHelp },
                { quoted: JSON.parse(JSON.stringify(baileysMessage)) },
            );
        }
            
        await sendAudioFromFile(`${AUDIOS_DIR}/menu/menuHelp.mp3`);
    },
};
