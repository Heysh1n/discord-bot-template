# 🤖 Discord Bot Template (TypeScript)

A **TypeScript Discord bot template** that can be used as a **moderator**, **helper**, or for any custom functionality.  
Includes integration with multiple APIs (YouTube, Twitch, Telegram, Kick) and MongoDB migrations support.

---

## ⚠️ Important Note  

<span style="color:red">⚠️ This bot was originally written in **Russian**.  
All main commands and functionality are currently available in **Russian language**.</span>  

Future updates may include full **English support**.

---

## ✨ Features

- ✅ Discord bot written in TypeScript  
- ✅ Social API integrations:  *(You can test with `npx ts-node src/migrations/<the file to run>`)*
  - YouTube API  
  - Twitch API  
  - Telegram Bot API
- ✅ MongoDB migrations support  
- ✅ Configurable via `.env`  
- ✅ Disocrd bot configurable via `src/config/config.ts`
- ✅ Automatic migration sync  
- ✅ Logging & console mode  
---

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/Heysh1n/discord-bot-template
cd discord-bot-template
````

2. Install dependencies:

```bash
npm install
```

3. Run the bot in development mode:

```bash
npm run dev
```

4. Build and Start the project:

```bash
npm run start
```

---

## ⚙️ Configuration (`.env`)

Create a `.env` file in the project root and add your keys:

```dotenv
# =========================
#        DISCORD BOT
# =========================
TOKEN=""                  # Your Discord bot token
INSCRIPTION="CONSOLE"     # Just cosmetic view in console

# =========================
#      SOCIAL API KEYS
# =========================
TWITCH_CLIENT_ID=""       
TWITCH_CLIENT_SECRET=""

YOUTUBE_API_KEY=""

TELEGRAM_BOT_TOKEN=""
GROUP_CHAT_ID=""

# =========================
#      MIGRATIONS DATABASE
# =========================
MIGRATE_MONGO_URI=""
DB_URI=""
MIGRATE_MONGO_COLLECTION="migrations"
DEVELOPER="995737379417640961"
MIGRATE_MIGRATIONS_PATH="./src/migrations"
MIGRATE_TEMPLATE_PATH="./src/migrations/template.ts"
MIGRATE_AUTOSYNC=true

ENV="development"
```

---

## 🛠️ Scripts

| Script          | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Run bot in dev mode (ts-node-dev)     |
| `npm run build` | Compile TypeScript → JavaScript       |
| `npm run start` | Run compiled bot and start production |
| `npm run fix`   | Run fixing any simple errors  (I don't use it, it's was wrotten in discordjs docs)        |

---

## 📁 Project Structure

```
src
├── base.ts                          - System files for working bot - just don't touch
├── constants.ts                     - System files for working bot - just don't touch
├── index.ts                         - Main file to start - here all doned - just don't touch
├── common                           - System folders for working bot - just don't touch
├── config
│   ├── config.ts                    - The discord bot config file
│   ├── permissions.config.ts        - The discord bot permissions config file
│   ├── components
│   │   └── global.components.ts     - The components files (use it for clean coding)
│   ├── db                           - Local Databases folder - here `.json` files (and cache)
│   └── embeds
│       └── global.embeds.ts         - The embeds files (use it for clean coding)
├── events                           - System folders for working bot - just don't touch  
├── interactions                     - In this folder you can create new slash-commands
│   ├── action                       - Folder name = name of your slash-command
│   │   └── functions                - Additional folder for migration code in other folders
│   ├── ping                        
│   │   ├── ping.command.ts          - In file starting registration slash-command in Discord 
│   │   └── ping.service.ts          - The logic of slash-command (all service)
├── migrations
│   ├── localCache.service.ts        - File to save User ID in cache for `/action`
│   ├── localdb.service.ts           - File to create/edit/view data in database for `/action`
│   ├── telegramAPI.responce.ts      - Telegram API responce - Already for using
│   ├── twitchAPI.response.ts        - Twitch API responce - Already for using
│   └── youtubeAPI.response.ts       - YouTube API responce  - Already for using

.env                                 - dotenv file - for configurate project in general
nodemon.json                         - Nodemon module for using bot in developing mode
package-lock.json                    - Package lock file for Dependencies
package.json                         - Package file for Dependencies and scripts
tsconfig.json                        - Typescipt config file
```

---

## 🚀 API Usage

### YouTube API

```ts
import YouTubeAPIClient from './src/migrations/youtubeAPI.response';

async function main() {
  const youtube = new YouTubeAPIClient();
  const channel = await youtube.getChannelByHandle('@LostLandsMinecraft');
  if (channel) {
    const videos = await youtube.getLatestVideos(channel.id, 3);
    videos.forEach(video => {
      console.log(`🎥 ${video.title}`);
      console.log(`👁️ ${video.viewCount} views`);
      console.log(`📅 Published: ${video.publishedAt}`);
    });
  }
}

main();
```

### Telegram API

```ts
import { TelegramAPIClient } from './src/interactions/telegramAPI.client';

async function telegramExample() {
  const telegram = new TelegramAPIClient(process.env.TELEGRAM_BOT_TOKEN!);
  await telegram.sendMessage(process.env.GROUP_CHAT_ID!, "Hello, World!");
  const updates = await telegram.getUpdates();
  console.log(updates);
}

telegramExample();
```

---

## ⚡ Bot Commands

| Command                                   | Description                                                                             |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| `/ping`                                   | Test the bot’s latency                                                                  |
| `/chat`                                   | Display technical data (server info, bot uptime, etc.)                                  |
| `/prune <amount> (<duration> & <member>)` | Clear chat messages (optionally filter by duration & member)                            |
| `/action <user>`                          | Perform a moderation action: mute, unmute, warnings, remove warnings, ban history, etc. |


---

## 💡 Note

This template can be extended and customized to build a **powerful multifunctional Discord bot**, fully integrated with social platforms and a custom database migration system.

---
## 🔗 Contact
- [Telegram](https://t.me/parlayanHs1n)
- Discord: `heysh1n`
