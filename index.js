const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@adiwajshing/baileys");
const { GPT4All } = require("gpt4all");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`Using WA version v${version.join('.')}, latest: ${isLatest}`);

    const sock = makeWASocket({
        version,
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
            if(lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log("Logged out.");
            }
        }
        console.log("Connection Update:", update);
    });

    const ai = new GPT4All({
        model: "gpt4all-lora-quantized.bin" // a local AI model
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if(!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        console.log(`Message from ${sender}: ${text}`);

        let reply = await ai.chat(text);

        await sock.sendMessage(sender, { text: reply });
    });
}

startBot();
