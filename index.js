require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

// In-memory data
const users = {};
const sessions = {};

// OWNER CONFIG
const OWNER_USERNAME = "itachiuchia359";
const OWNER_BALANCE = 999999999999;

// === HELPERS ===
function isLoggedIn(ctx) {
  return sessions[ctx.from.id];
}

function isOwner(ctx) {
  return ctx.from.username === OWNER_USERNAME;
}

function getUser(id) {
  return users[id];
}

function ensureUser(ctx) {
  const id = ctx.from.id;
  if (!users[id]) {
    users[id] = { username: ctx.from.username || `user${id}`, balance: 1000, xp: 0, level: 1 };
  }
}

function ensureInventory(id) {
  if (!users[id].inventory) users[id].inventory = {};
}

// ====== CORE COMMANDS ======
bot.start((ctx) => {
  ctx.reply(`👋 Welcome, ${ctx.from.first_name}! Type /help to see all commands.`);
});

bot.command('help', (ctx) => {
  ctx.reply(`
📜 Available Commands:
/start - Start the bot
/help - Show all commands
/register - Create a new account
/login - Log into your account
/logout - Log out from your session
/balance - Show your current balance
/send username amount - Send money to another user
/profile - View your profile
/update username newname - Change your username
/reset - Reset your account (balance → 1000)
/top - Show top 10 richest users
/work - Earn random money
/daily - Claim daily reward
/coinflip heads|tails amount - Gamble with coinflip
/level - Show your XP and level
/shop - View shop items
/buy itemname - Buy an item
/inventory - View your inventory
/use itemname - Use an item

👑 Owner Only:
/allusers - View all users
/setbalance username amount - Set user balance
/giveall amount - Give all users money
`);
});

bot.command('register', (ctx) => {
  const id = ctx.from.id;
  if (users[id]) return ctx.reply('You already have an account! Use /login.');
  users[id] = { username: ctx.from.username || `user${id}`, balance: 1000, xp: 0, level: 1 };
  ctx.reply('✅ Account created! Use /login to access it.');
});

bot.command('login', (ctx) => {
  const id = ctx.from.id;
  ensureUser(ctx);
  sessions[id] = true;

  if (isOwner(ctx)) {
    users[id].balance = OWNER_BALANCE;
    ctx.reply(`👑 Welcome back, Owner @${OWNER_USERNAME}! Balance set to 💎 ${OWNER_BALANCE}`);
  } else {
    ctx.reply(`✅ Logged in as ${users[id].username}`);
  }
});

bot.command('logout', (ctx) => {
  const id = ctx.from.id;
  if (sessions[id]) {
    delete sessions[id];
    return ctx.reply('🔒 Logged out successfully.');
  }
  ctx.reply('You are not logged in.');
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
  if (!targetUser) return ctx.reply('User not found.');

  const amount = parseInt(args[2]);
  if (isNaN(amount) || amount <= 0) return ctx.reply('Invalid amount.');
  if (users[id].balance < amount) return ctx.reply('Insufficient balance.');

  users[id].balance -= amount;
  targetUser.balance += amount;
  ctx.reply(`✅ Sent ${amount} to ${args[1]}! Your new balance: ${users[id].balance}`);
});

bot.command('profile', (ctx) => {
  const id = ctx.from.id;
  if (!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  const user = users[id];
  ctx.reply(`👤 Profile: ${user.username}\n💰 Balance: ${user.balance}\n⭐ Level: ${user.level}\n🔥 XP: ${user.xp}`);
});

bot.command('update', (ctx) => {
  const id = ctx.from.id;
  if (!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  const args = ctx.message.text.split(' ');
  if (args.length < 3) return ctx.reply('Usage: /update username newname');

  const key = args[1];
  const value = args.slice(2).join(' ');
  if (key !== 'username') return ctx.reply('You can only update username.');

  users[id][key] = value;
  ctx.reply(`✅ Updated your ${key} to ${value}`);
});

bot.command('reset', (ctx) => {
  const id = ctx.from.id;
  if (!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  users[id] = { username: users[id].username, balance: 1000, xp: 0, level: 1 };
  ctx.reply('🔄 Your account has been reset.');
});

// ====== ADVANCED ECONOMY ======
const claimedDaily = {};

bot.command('top', (ctx) => {
  const sorted = Object.values(users).sort((a,b)=>b.balance-a.balance).slice(0,10);
  if(!sorted.length) return ctx.reply('No users registered yet.');
  let msg = "🏆 Top 10 Richest Users:\n";
  sorted.forEach((u,i)=>{ msg+=`${i+1}. @${u.username} → 💰 ${u.balance}\n` });
  ctx.reply(msg);
});

bot.command('work', (ctx)=>{
  const id = ctx.from.id;
  if(!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  const earned = Math.floor(Math.random()*200)+50;
  users[id].balance += earned;
  users[id].xp += 10;
  ctx.reply(`💼 You worked hard and earned 💰 ${earned}! (+10 XP)`);
});

bot.command('daily',(ctx)=>{
  const id = ctx.from.id;
  if(!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  const today = new Date().toDateString();
  if(claimedDaily[id]===today) return ctx.reply('⏳ You already claimed daily today.');
  claimedDaily[id]=today;
  users[id].balance+=500;
  users[id].xp+=20;
  ctx.reply(`🎁 Daily reward claimed! +💰500 (+20 XP)`);
});

bot.command('coinflip',(ctx)=>{
  const id = ctx.from.id;
  if(!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  const args = ctx.message.text.split(' ');
  if(args.length!==3) return ctx.reply('Usage: /coinflip heads|tails amount');

  const choice = args[1].toLowerCase();
  if(!['heads','tails'].includes(choice)) return ctx.reply('Choose heads or tails.');
  const bet = parseInt(args[2]);
  if(isNaN(bet)||bet<=0) return ctx.reply('Invalid bet amount.');
  if(users[id].balance<bet) return ctx.reply('Insufficient balance.');

  const result = Math.random()<0.5?'heads':'tails';
  if(result===choice){
    users[id].balance+=bet;
    ctx.reply(`🎉 It was ${result}! You won 💰 ${bet}!`);
  }else{
    users[id].balance-=bet;
    ctx.reply(`😢 It was ${result}! You lost 💰 ${bet}.`);
  }
});

bot.command('level',(ctx)=>{
  const id=ctx.from.id;
  if(!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  ctx.reply(`⭐ Level: ${users[id].level}\n🔥 XP: ${users[id].xp}`);
});

// ====== OWNER COMMANDS ======
bot.command('allusers',(ctx)=>{
  if(!isOwner(ctx)) return ctx.reply('⛔ Owner only command.');
  let result="📋 All Users:\n";
  for(const u of Object.values(users)) result+=`@${u.username} → 💰 ${u.balance}\n`;
  ctx.reply(result||"No users registered yet.");
});

bot.command('setbalance',(ctx)=>{
  if(!isOwner(ctx)) return ctx.reply('⛔ Owner only command.');
  const args = ctx.message.text.split(' ');
  if(args.length!==3) return ctx.reply('Usage: /setbalance username amount');
  const targetUser = Object.values(users).find(u=>u.username===args[1]);
  if(!targetUser) return ctx.reply('User not found.');
  const amount=parseInt(args[2]);
  if(isNaN(amount)||amount<0) return ctx.reply('Invalid amount.');
  targetUser.balance=amount;
  ctx.reply(`✅ Set balance of ${args[1]} to ${amount}`);
});

bot.command('giveall',(ctx)=>{
  if(!isOwner(ctx)) return ctx.reply('⛔ Owner only command.');
  const args = ctx.message.text.split(' ');
  if(args.length!==2) return ctx.reply('Usage: /giveall amount');
  const amount=parseInt(args[1]);
  if(isNaN(amount)||amount<=0) return ctx.reply('Invalid amount.');
  for(const u of Object.values(users)) u.balance+=amount;
  ctx.reply(`✅ Added ${amount} to all users!`);
});

// ====== MINI SHOP SYSTEM ======
const shopItems={
  "sword": {name:"Sword 🗡️", price:500, description:"Increase your attack power."},
  "shield": {name:"Shield 🛡️", price:400, description:"Protects you from losses."},
  "potion": {name:"Potion 🧪", price:200, description:"Restore 100 balance instantly."}
};

bot.command('shop',(ctx)=>{
  ensureUser(ctx);
  let msg="🛒 Available Shop Items:\n";
  for(const key in shopItems){
    const item=shopItems[key];
    msg+=`• ${item.name} - 💰 ${item.price} | ${item.description}\n`;
  }
  ctx.reply(msg);
});

bot.command('buy',(ctx)=>{
  const id=ctx.from.id;
  if(!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  ensureInventory(id);
  const args=ctx.message.text.split(' ');
  if(args.length!==2) return ctx.reply('Usage: /buy itemname');
  const itemKey=args[1].toLowerCase();
  const item=shopItems[itemKey];
  if(!item) return ctx.reply('Item not found.');
  if(users[id].balance<item.price) return ctx.reply('💸 Not enough balance.');
  users[id].balance-=item.price;
  users[id].inventory[itemKey]=(users[id].inventory[itemKey]||0)+1;
  ctx.reply(`✅ You bought 1 ${item.name}!`);
});

bot.command('inventory',(ctx)=>{
  const id=ctx.from.id;
  if(!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  ensureInventory(id);
  const inv=users[id].inventory;
  if(Object.keys(inv).length===0) return ctx.reply('📦 Your inventory is empty.');
  let msg="📦 Your Inventory:\n";
  for(const key in inv){
    const item=shopItems[key];
    msg+=`• ${item.name} x${inv[key]} - ${item.description}\n`;
  }
  ctx.reply(msg);
});

bot.command('use',(ctx)=>{
  const id=ctx.from.id;
  if(!isLoggedIn(ctx)) return ctx.reply('Please /login first.');
  ensureInventory(id);
  const args=ctx.message.text.split(' ');
  if(args.length!==2) return ctx.reply('Usage: /use itemname');
  const itemKey=args[1].toLowerCase();
  const item=shopItems[itemKey];
  if(!item||!users[id].inventory[itemKey]||users[id].inventory[itemKey]<=0) return ctx.reply('You do not own this item.');
  if(itemKey==="potion"){
    users[id].balance+=100;
    ctx.reply(`🧪 You used a Potion! +💰100 balance`);
  }else if(itemKey==="sword"){
    ctx.reply(`🗡️ You equipped a Sword! (Demo)`);
  }else if(itemKey==="shield"){
    ctx.reply(`🛡️ You equipped a Shield! (Demo)`);
  }
  users[id].inventory[itemKey]-=1;
  if(users[id].inventory[itemKey]===0) delete users[id].inventory[itemKey];
});

// ====== LAUNCH BOT ======
bot.launch();
console.log("✅ Advanced Economy Bot is running!");
