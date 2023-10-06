const { JSON_DIR } = require("../config");
const fs = require("fs");

exports.getPremiumStatus = (memberJid, remoteJid) => {
    const userFilePath = `${JSON_DIR}/user/${memberJid.split('@')[0]}.json`;
    const groupFilePath = `${JSON_DIR}/group/${remoteJid}.json`;

    let userPremiumStatus = "Inativo";
    let groupPremiumStatus = "Inativo";

    try {
        if (fs.existsSync(userFilePath)) {
            const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

            if (userData.premium && userData.premium === true) {
                const premiumExpirationDateString = userData.premiumExpirationDate;
                const currentDate = new Date();
                const [, day, month, year, time] = premiumExpirationDateString.match(/(\d+)\/(\d+)\/(\d+) às (\d+:\d+:\d+)/);
                const [hour, minute, second] = time.split(':');
                const premiumExpirationDate = new Date(year, month - 1, day, hour, minute, second);

                if (!isNaN(premiumExpirationDate.getTime())) {
                    const timeDifference = premiumExpirationDate.getTime() - currentDate.getTime();
                    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;

                    if (daysRemaining > 0) {
                        userPremiumStatus = `Ativo (Expira em ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'})`;
                    } else {
                        userPremiumStatus = `Expirou (${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'dia' : 'dias'} atrás)`;
                    }
                }
            }
        }

        if (fs.existsSync(groupFilePath)) {
            const groupData = JSON.parse(fs.readFileSync(groupFilePath, 'utf-8'));

            if (groupData.premium && groupData.premium === true) {
                const premiumExpirationDateString = groupData.premiumExpirationDate;
                const currentDate = new Date();
                const [, day, month, year, time] = premiumExpirationDateString.match(/(\d+)\/(\d+)\/(\d+) às (\d+:\d+:\d+)/);
                const [hour, minute, second] = time.split(':');
                const premiumExpirationDate = new Date(year, month - 1, day, hour, minute, second);

                if (!isNaN(premiumExpirationDate.getTime())) {
                    const timeDifference = premiumExpirationDate.getTime() - currentDate.getTime();
                    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;

                    if (daysRemaining > 0) {
                        groupPremiumStatus = `Ativo (Expira em ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'})`;
                    } else {
                        groupPremiumStatus = `Expirou (${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'dia' : 'dias'} atrás)`;
                    }
                }
            }
        }

        return { userPremiumStatus, groupPremiumStatus };
    } catch (error) {
        console.error(error);
        return { userPremiumStatus: "Erro", groupPremiumStatus: "Erro" };
    }
};
