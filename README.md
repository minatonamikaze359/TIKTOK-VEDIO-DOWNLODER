# 💬 Telegram Economy Bot

A simple **Telegram bot** built with [Telegraf](https://telegraf.js.org/) that includes:
- 👤 User Registration & Login
- 💰 Virtual Balance System
- 🔄 Send Money Between Users
- 🛠 Owner Controls (set balance, give all users money)
- 🔒 Secure `.env` Support

---

## 🚀 Features

✅ **User Commands**
| Command | Description |
|--------|-------------|
| `/start` | Start the bot & get welcome message |
| `/help` | Show all available commands |
| `/register` | Create a new account |
| `/login` | Log into your account |
| `/logout` | Log out of your session |
| `/balance` | Show your current balance |
| `/send username amount` | Send money to another user |
| `/profile` | View your profile details |
| `/update username newname` | Change your username |
| `/reset` | Reset your account (balance → 1000) |

✅ **Owner Commands**
| Command | Description |
|--------|-------------|
| `/allusers` | View all registered users & their balances |
| `/setbalance username amount` | Set balance for a user |
| `/giveall amount` | Give balance to all users |

> 🏆 **Owner** automatically gets **unlimited balance (999999999999)** on login.

---

## 📦 Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/YOUR-USERNAME/telegram-economy-bot.git
cd telegram-economy-bot
````

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Create `.env` File

Create a file named `.env` and add your Telegram bot token:

```env
BOT_TOKEN=YOUR_BOT_TOKEN_HERE
```

> ⚠️ Replace `YOUR_BOT_TOKEN_HERE` with the token from [@BotFather](https://t.me/BotFather).

### 4️⃣ Start the Bot

```sh
npm start
```

---

## 🖥 Run on Replit

1. Create a new **Node.js Repl**
2. Upload `index.js`, `package.json`, `.env`, `.gitignore`
3. Open the shell and run:

```sh
npm install
npm start
```

---

## 🔒 Security

* Your bot token is stored securely in `.env`
* `.env` is ignored by Git (see `.gitignore`)

---

## 📄 License

MIT License – You are free to use, modify, and share this bot.

---

## 💡 Tips

* Test commands in a **private chat** first
* Share your bot link only after confirming everything works
* Extend features: add a **shop system**, **leaderboard**, or **games**

---

👨‍💻 Developed by **[Tamim](https://github.com/minatonamikaze359)
