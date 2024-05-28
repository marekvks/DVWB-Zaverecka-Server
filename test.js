const tokens = [];

const generateToken = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = "";

    while (true) {
        for (let i = 0; i < length; i++) {
            token += characters[(Math.floor(Math.random() * characters.length))];
        }

        if (tokens.find(t => t.token === token))
            continue;

        console.log("token je", token);

        tokens.push({ token });
        return token;
    }
}

console.log(generateToken(10));