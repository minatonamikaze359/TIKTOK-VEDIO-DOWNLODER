# 💬 Telegram Economy Bot

A fully-featured 

* 👤 User Registration & Login
* 💰 Virtual Balance System
* 🔄 Send Money Between Users
* 🏆 Leaderboard
* 🛒 Mini Shop System
* 🔒 Secure `.env` Support
* 👑 Owner Controls

---

## 🚀 Features

### ✅ User Commands

| Command                    | Description                         |                        |
| -------------------------- | ----------------------------------- | ---------------------- |
| `/start`                   | Start the bot & get welcome message |                        |
| `/help`                    | Show all available commands         |                        |
| `/register`                | Create a new account                |                        |
| `/login`                   | Log into your account               |                        |
| `/logout`                  | Log out from your session           |                        |
| `/balance`                 | Show your current balance           |                        |
| `/send username amount`    | Send money to another user          |                        |
| `/profile`                 | View your profile details           |                        |
| `/update username newname` | Change your username                |                        |
| `/reset`                   | Reset your account (balance → 1000) |                        |
| `/top`                     | Show top 10 richest users           |                        |
| `/work`                    | Earn random money (+XP)             |                        |
| `/daily`                   | Claim daily reward (+XP)            |                        |
| \`/coinflip heads          | tails amount\`                      | Gamble with a coinflip |
| `/level`                   | Show your XP and level              |                        |

### 🛒 Mini Shop System

| Command         | Description         |
| --------------- | ------------------- |
| `/shop`         | View shop items     |
| `/buy itemname` | Buy an item         |
| `/inventory`    | View your inventory |
| `/use itemname` | Use an item         |

**Shop Items**

| Item       | Price | Effect                |
| ---------- | ----- | --------------------- |
| Sword 🗡️  | 500   | Just for demo (equip) |
| Shield 🛡️ | 400   | Just for demo (equip) |
| Potion 🧪  | 200   | Restore +100 balance  |

### 👑 Owner Only Commands

| Command                       | Description                          |
| ----------------------------- | ------------------------------------ |
| `/allusers`                   | View all registered users & balances |
| `/setbalance username amount` | Set balance for a user               |
| `/giveall amount`             | Give balance to all users            |

> The **Owner** automatically gets **unlimited balance** on login.
> Owner username: `@itachiuchia359`

---

## 📦 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/telegram-economy-bot.git
cd telegram-economy-bot
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create `.env` File

Create a file named `.env` and add your Telegram bot token:

```env
BOT_TOKEN=YOUR_BOT_TOKEN_HERE
```

> Replace `YOUR_BOT_TOKEN_HERE` with the token from [@BotFather](https://t.me/BotFather).

### 4️⃣ Start the Bot

```bash
npm start
```

---

## 🖥 Run on Replit

1. Create a new **Node.js Repl**
2. Upload `index.js`, `package.json`, `.env`, `.gitignore`
3. Open the shell and run:

```bash
npm install
npm start
```

---

## 🔒 Security

* Bot token is stored securely in `.env`
* `.env` is ignored by Git (see `.gitignore`)

---

## 💡 Tips

* Test commands in a **private chat** first
* Share your bot link only after confirming everything works
* Extend features: add **quests**, **shop upgrades**, or **games**

---

## 📄 License

MIT License – Free to use, modify, and share.
