const { JSON_DIR } = require("../config");
const fs = require("fs");

exports.getPremiumStatus = (memberJid) => {
    const filePath = `${JSON_DIR}/user/${memberJid.split('@')[0]}.json`;

    try {
        if (fs.existsSync(filePath)) {
            const jsonData = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(jsonData);

            if (data.premium) {
                const premiumExpirationDateString = data.premiumExpirationDate;
                const currentDate = new Date();
                const [, day, month, year, time] = premiumExpirationDateString.match(/(\d+)\/(\d+)\/(\d+) às (\d+:\d+:\d+)/);
                const [hour, minute, second] = time.split(':');
                const premiumExpirationDate = new Date(year, month - 1, day, hour, minute, second);

                if (!isNaN(premiumExpirationDate.getTime())) {
                    const timeDifference = premiumExpirationDate.getTime() - currentDate.getTime();
                    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;

                    if (daysRemaining > 0) {
                        return `Ativo (Expira em ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'})`;
                    } else {
                        return `Expirou (${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'dia' : 'dias'} atrás)`;
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
    }

    return "Inativo"; 
};
