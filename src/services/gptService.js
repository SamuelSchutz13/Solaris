const axios = require("axios");
const { GPT_API_KEY } = require("../config");

exports.gpt = async (content) => {
    if (!GPT_API_KEY) {
        throw new Error(
        "Configurar o TOKEN OPENAI_API_KEY"
        );
    }

    const { data } = await axios.post(
        `https://api.pawan.krd/v1/chat/completions`,
        {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content}],
        },
        {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GPT_API_KEY}`,
        },
    }
);

return data.choices[0].message.content;
};
