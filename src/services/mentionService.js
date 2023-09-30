exports.mentionUser = (participant) => {
    return `@${participant.id.replace('@s.whatsapp.net', '')}`;
}