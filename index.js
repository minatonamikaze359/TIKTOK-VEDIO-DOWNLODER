require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ------------------ DATA SETUP ------------------
const dataDir = './data';
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const usersFile = `${dataDir}/users.json`;
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify({}));

const loadUsers = () => JSON.parse(fs.readFileSync(usersFile));
const saveUsers = (data) => fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));

// ------------------ OWNER & BOT INFO ------------------
const OWNER = '+8801405706180';
const GEMINI_API_KEY = 'AIzaSyDXD3ywaFPTsLVjbYHZShCdod1iOD1-igA';

// ------------------ GEMINI CHATBOT ------------------
async function chatWithGemini(message) {
  try {
    const response = await axios.post(
      'https://gemini.api.openai.com/v1/chat', // hypothetical Gemini endpoint
      { prompt: message, model: 'gemini-1.5' },
      { headers: { Authorization: `Bearer ${GEMINI_API_KEY}` } }
    );
    return response.data.reply || "I couldn't understand that!";
  } catch (err) {
    console.error(err);
    return 'Error: Gemini API failed!';
  }
}

// ------------------ HELPER ------------------
const ensureUser = (id, username) => {
  const users = loadUsers();
  if (!users[id]) {
    users[id] = { username: username || 'Unknown', balance: 1000, inventory: [], xp: 0 };
    saveUsers(users);
  }
  return users[id];
};

// ------------------ START ------------------
bot.start((ctx) => {
  ensureUser(ctx.from.id.toString(), ctx.from.username || ctx.from.first_name);
  ctx.reply(`
*╭══〘〘 SASUKE BOT 〙〙*
*┃❍ ʀᴜɴ     :* 01h 21m 37s
*┃❍ ᴍᴏᴅᴇ    :* Public
*┃❍ ᴘʀᴇғɪx  :* [.,!]
*┃❍ ʀᴀᴍ     :* 159.11 / 384.22 GB
*┃❍ ᴠᴇʀsɪᴏɴ :* v3.5.0
*┃❍ ᴜsᴇʀ    :* Sasuke Uchiha
*╰═════════════════⊷*`);
});

// ------------------ COMMAND HANDLER ------------------
bot.on('text', async (ctx) => {
  const msg = ctx.message.text;
  const args = msg.split(' ');
  const cmd = args[0].replace(/[.,!]/, '').toLowerCase();
  const id = ctx.from.id.toString();
  const users = loadUsers();
  ensureUser(id, ctx.from.username || ctx.from.first_name);

  // ------------------ OWNER COMMANDS ------------------
  if (id === OWNER) {
    switch (cmd) {
      case 'setbalance':
        {
          const target = args[1];
          const amount = parseInt(args[2]);
          if (users[target]) {
            users[target].balance = amount;
            saveUsers(users);
            return ctx.reply(`Balance of ${target} set to ${amount}`);
          } else return ctx.reply('User not found!');
        }
      case 'chatbot':
        {
          const message = args.slice(1).join(' ');
          if (!message) return ctx.reply('Type something to chat.');
          const reply = await chatWithGemini(message);
          return ctx.reply(reply);
        }
      case 'ban':
        return ctx.reply('User banned (placeholder)');
      case 'unban':
        return ctx.reply('User unbanned (placeholder)');
      // add other owner commands here
    }
  }

  // ------------------ FUN COMMANDS ------------------
  switch (cmd) {
    case '8ball': return ctx.reply('🎱 Yes, definitely!');
    case 'dice': return ctx.reply(`🎲 You rolled ${Math.floor(Math.random() * 6) + 1}`);
    case 'coin': return ctx.reply(`🪙 ${Math.random() < 0.5 ? 'Heads' : 'Tails'}`);
    case 'fortune': return ctx.reply('🔮 Your fortune is good today!');
    case 'pickup': return ctx.reply('💌 Do you believe in love at first sight?');
    case 'roast': return ctx.reply('😏 Your code is as messy as spaghetti!');
    // anime
    case 'neko': return ctx.reply('🐱 Neko image placeholder');
    case 'waifu': return ctx.reply('💖 Waifu image placeholder');
  }

  // ------------------ SYSTEM COMMANDS ------------------
  switch (cmd) {
    case 'restart': return ctx.reply('Bot restarting...');
    case 'plugin': return ctx.reply('Plugin system activated');
  }

  // ------------------ CHATBOT GENERAL ------------------
  if (cmd === 'chat') {
    const message = args.slice(1).join(' ');
    if (!message) return ctx.reply('Type a message to chat.');
    const reply = await chatWithGemini(message);
    return ctx.reply(reply);
  }

  // ------------------ DEFAULT ------------------
  ctx.reply('Unknown command. Type .help to see all commands.');
});

// ------------------ BOT LAUNCH ------------------
bot.launch();
console.log('SASUKE BOT is running...');
