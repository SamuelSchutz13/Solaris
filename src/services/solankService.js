const year = new Date().getFullYear();
const yearAgency = year;

function solankService(userData, debitCoins, baileysMessage) {
    return `
╭─「*Solank*」
│ 
│─ *Titular*: ${baileysMessage?.pushName} 
│─ *Agência:* ${yearAgency}-1
│─ *Conta:* ${generateRandomNumberFormat()}
│─ *Saldo:* ${userData.coins}
│─ *Cartão:* _Em Breve_
│
╰─「_*₹${debitCoins}* Solarcoins debitadas_」
    `;
}

function getRandomNumber() {
    return Math.floor(Math.random() * 10);
}

function generateRandomNumberFormat() {
    const randomNumber1 = getRandomNumber();
    const randomNumber2 = getRandomNumber();
    const randomNumber3 = getRandomNumber();
    const randomNumber4 = getRandomNumber();

    const formattedNumber = `${randomNumber1}${randomNumber2}${randomNumber3}-${randomNumber4}`;
    return formattedNumber;
}


module.exports = { solankService };