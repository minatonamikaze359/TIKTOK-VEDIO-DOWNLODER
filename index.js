
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');

// ===== CONFIG =====
const BOT_TOKEN = '8433056245:AAHvLCh443KxXCzv43EGEl7B48dhbz_OSLM'; // replace with your bot token
const OWNER_ID = 8801405706180; // your owner number

const bot = new Telegraf(BOT_TOKEN);

// ===== DATA STORAGE =====
const dataPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);

const balancesFile = path.join(dataPath, 'balances.json');
if (!fs.existsSync(balancesFile)) fs.writeFileSync(balancesFile, JSON.stringify({}));

const getBalances = () => JSON.parse(fs.readFileSync(balancesFile));
const saveBalances = (data) => fs.writeFileSync(balancesFile, JSON.stringify(data, null, 2));

// ===== PREFIX HANDLER =====
const getCommand = (text) => text.split(' ')[0].replace(/^[/.,!]/, '').toLowerCase();
const getArgs = (text) => text.split(' ').slice(1);

// ===== HELP TEXT =====
const helpText = `
*╭───〘 SASUKE BOT COMMANDS 〙───╮*
*┃ Anime:* neko, waifu, animegirl
*┃ Audio-Edit:* bass, slow, blown, deep, earrape, fast, fat, nightcore, reverse, squirrel
*┃ Converter:* photo, voice, gif, mp3, asticker, msticker, steal, stickerpack, doc, sticker, fancy, bubble, reverse, mock, aesthetic, trt, tts, url
*┃ Create:* emix
*┃ Download:* fb, ig, song, video
*┃ Filter:* filter, stop
*┃ Fun:* 8ball, fortune, dice, coin, gamble, lottery, roast, pickup, truth, dare, wouldyou, advice, flip, fortune, magic8, choose, compliment, fact, trivia, science, history, cry, cuddle, bully, hug, awoo, lick, pat, smug, bonk, yeet, blush, handhold, highfive, nom, wave, joke, dadjoke, pun, meme, rmeme, dmeme, programming, mtemplates, quote, motivate, wisdom, love, dance, happy, confused
*┃ Fun_IMG:* cosplay
*┃ General:* channeljid, savechannel, getchannels, jid
*┃ Group:* promote, demote, revoke, invite, lock, unlock, mute, unmute, gdesc, gname, gpp, left, add, ginfo, kick, tagall, welcome, goodbye
*┃ Info:* platform, ping, repo, getpp
*┃ Information:* dob, country, checkapi
*┃ Logo:* 3dcomic, dragonball, deadpool, blackpink, neonlight, cat, sadgirl, naruto, thor, america, eraser, 3dpaper, futuristic, clouds, sand, galaxy, leaf, hacker, boom, floral, zodiac, angel
*┃ Manage:* antiword, antilink, antifake, antidelete, antibot, antidemote, antipromote, pdm
*┃ Media:* black
*┃ Misc:* toggle, vote
*┃ Owner:* ban, unban, chatbot, join, block, unblock, pp, fullpp
*┃ Privacy:* getprivacy, lastseen, online, mypp, mystatus, read, groupadd
*┃ Search:* img
*┃ System:* restart, plugin, remove
*┃ Tools:* pair, vv, vvf
*┃ User:* mention
*┃ Utility:* calc, convert, take, password, passcheck, qr, readqr, short, expand, weather
*┃ WhatsApp:* menu, clear, archive, unarchive, chatpin, unpin, setbio, setname, disappear
*╰────────────────────────────╯
Use .<command> or /<command>
`;

// ===== COMMAND HANDLER =====
bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    const cmd = getCommand(text);
    const args = getArgs(text);

    // -------- HELP --------
    if (['help', 'menu'].includes(cmd)) {
        return ctx.reply(helpText, { parse_mode: 'Markdown' });
    }

    // -------- CHATBOT --------
    if (cmd === 'chat') {
        const chatMessage = args.join(' ');
        if (!chatMessage) return ctx.reply('Send something to chat!');
        
        // ===== Gemini API integration placeholder =====
        // Example: const reply = await callGeminiAPI(chatMessage);
        const reply = `You said: ${chatMessage}`; 
        return ctx.reply(reply);
    }

    // -------- OWNER COMMANDS --------
    const userId = ctx.from.id;
    const balances = getBalances();

    if (cmd === 'setbalance' && userId == OWNER_ID) {
        const target = args[0];
        const amount = args[1];
        if (!target || !amount) return ctx.reply('Usage: .setbalance <user_id> <amount>');
        balances[target] = parseInt(amount);
        saveBalances(balances);
        return ctx.reply(`Balance of ${target} set to ${amount}`);
    }

    if (cmd === 'balance') {
        const target = args[0] || userId;
        const bal = balances[target] || 0;
        return ctx.reply(`Balance of ${target}: ${bal}`);
    }

    // -------- DEFAULT UNKNOWN COMMAND --------
    return ctx.reply('Unknown command. Type .help to see all commands.');
});

// ===== START BOT =====
bot.launch();
console.log('Sasuke Bot is running...');
