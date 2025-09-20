const { Telegraf } = require('telegraf');
const bot = new Telegraf('8433056245:AAHvLCh443KxXCzv43EGEl7B48dhbz_OSLM');

// Owner phone/ID (change this to your Telegram user ID)
const OWNER_ID = 8801405706180; // Replace with your real Telegram numeric ID

// In-memory user data (demo only)
const users = {};
const sessions = {};

// Helper to check if logged in
function isLoggedIn(ctx) {
  return sessions[ctx.from.id];
}

// Helper to check if user is owner
function isOwner(ctx) {
  return ctx.from.id === OWNER_ID;
}

// Commands
bot.start((ctx) => {
  ctx.reply(`👋 Welcome, ${ctx.from.first_name}! Type /help to see all commands.`);
});

bot.command('help', (ctx) => {
  ctx.reply(`
📖 Available Commands:
/start - Start the bot and see welcome message
/help - Show all available commands
/register - Create a new account
/login - Log into your account
/logout - Log out from your session
/balance - Show your current balance
/send - Transfer money to another user (usage: /send username amount)
/profile - View your profile details
/update - Update your account info (usage: /update key value)
/reset - Reset your account data

👑 Owner Commands:
/allusers - View all registered users
/setbalance <username> <amount> - Set balance for a user
/giveall <amount> - Give all users balance
`);
});

bot.command('register', (ctx) => {
  const id = ctx.from.id;
  if (users[id]) return ctx.reply('⚠️ You already have an account! Use /login.');

  users[id] = { username: ctx.from.username || `user${id}`, balance: 1000 };
  ctx.reply('✅ Account created! Use /login to access it.');
});

bot.command('login', (ctx) => {
  const id = ctx.from.id;
  if (!users[id]) return ctx.reply('❌ No account found. Please /register first.');

  sessions[id] = true;
  ctx.reply(`✅ Logged in as ${users[id].username}`);
});

bot.command('logout', (ctx) => {
  const id = ctx.from.id;
  if (sessions[id]) {
    delete sessions[id];
    return ctx.reply('🔒 Logged out successfully.');
  }
  ctx.reply('⚠️ You are not logged in.');
});

bot.command('balance', (ctx) => {
  const id = ctx.from.id;
  if (!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  ctx.reply(`💰 Your balance: ${users[id].balance}`);
});

bot.command('send', (ctx) => {
  const id = ctx.from.id;
  if (!isLoggedIn(ctx)) return ctx.reply('Please /login first.');

  const args = ctx.message.text.split(' ');
  if (args.length !== 3) return ctx.reply('Usage: /send username amount');

  const targetUser = Object.values(users).find(u => u.username === args[1]);
  if (!targetUser) return ctx.reply('❌ User not found.');

  const amount = parseInt(args[2]);
  if (isNaN(amount) || amount <= 0) return ctx.reply('❌ Invalid amount.');
  if (users[id].balance < amount) return ctx.reply('💸 Insufficient balance.');

  users[id].balance -= amount;
  targetUser.balance += amount;

  ctx.reply(`✅ Sent ${amount} to ${args[1]}! Your new balance: ${users[id].balance}`);
});

bot.command('profile', (ctx) => {
  const id = ctx.from.id;
  if (!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  const user = users[id];
  ctx.reply(`👤 Profile:
Username: ${user.username}
Balance: ${user.balance}`);
});

bot.command('update', (ctx) => {
  const id = ctx.from.id;
  if (!isLoggedIn(ctx)) return ctx.reply('Please /login first.');

  const args = ctx.message.text.split(' ');
  if (args.length < 3) return ctx.reply('Usage: /update key value');

  const key = args[1];
  const value = args.slice(2).join(' ');

  if (key !== 'username') return ctx.reply('You can only update your username.');

  users[id][key] = value;
  ctx.reply(`✅ Updated your ${key} to ${value}`);
});

bot.command('reset', (ctx) => {
  const id = ctx.from.id;
  if (!isLoggedIn(ctx)) return ctx.reply('Please /login first.');

  users[id] = { username: users[id].username, balance: 1000 };
  ctx.reply('🔄 Your account has been reset.');
});

// 🔥 OWNER COMMANDS 🔥
bot.command('allusers', (ctx) => {
  if (!isOwner(ctx)) return ctx.reply('❌ You are not authorized to use this command.');

  if (Object.keys(users).length === 0) return ctx.reply('No users found.');
  let list = '📋 Registered Users:\n';
  for (const id in users) {
    list += `👤 ${users[id].username} | 💰 ${users[id].balance}\n`;
  }
  ctx.reply(list);
});

bot.command('setbalance', (ctx) => {
  if (!isOwner(ctx)) return ctx.reply('❌ You are not authorized to use this command.');

  const args = ctx.message.text.split(' ');
  if (args.length !== 3) return ctx.reply('Usage: /setbalance username amount');

  const targetUser = Object.values(users).find(u => u.username === args[1]);
  if (!targetUser) return ctx.reply('❌ User not found.');

  const amount = parseInt(args[2]);
  if (isNaN(amount)) return ctx.reply('❌ Invalid amount.');

  targetUser.balance = amount;
  ctx.reply(`✅ Set ${args[1]}'s balance to ${amount}`);
});

bot.command('giveall', (ctx) => {
  if (!isOwner(ctx)) return ctx.reply('❌ You are not authorized to use this command.');

  const args = ctx.message.text.split(' ');
  if (args.length !== 2) return ctx.reply('Usage: /giveall amount');

  const amount = parseInt(args[1]);
  if (isNaN(amount)) return ctx.reply('❌ Invalid amount.');

  for (const id in users) {
    users[id].balance += amount;
  }

  ctx.reply(`💰 Gave ${amount} to all users.`);
});

// Launch bot
bot.launch();
console.log('🤖 Bot running with owner commands...');
