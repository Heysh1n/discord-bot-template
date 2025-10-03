import { config } from "dotenv";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import EventHandlerService from "./events/system/collectors/event.collector";
import { Button, CustomId, Intervals, SlashCommand, UserID } from "./base";
import * as moment from "moment-timezone";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as moduleAlias from "module-alias";
import {channel_Errors} from "@config/config";
import { setupGlobalErrorHandler } from "@events/system/services/errorHandler.function";


moduleAlias.addAliases({
  "@/": __dirname,
  "@events": __dirname + "/events",
  "@base": __dirname + "/base",
  "@models": __dirname + "/models",
  "@configs": __dirname + "/configs",
  "@elements": __dirname + "/elements",
  "@common": __dirname + "/common",
  "@decorators": __dirname + "/common/decorators",
  "@functions": __dirname + "/common/functions",
  "@structures": __dirname + "/common/structure",
  "@constants": __dirname + "/constants",
});

moment.tz.setDefault(`Europe/Moscow`);
config();

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates,
];

export const client: Client = new Client({ intents: intents });
client.commands = new Collection<string, SlashCommand>(); // Команды
client.buttons = new Collection<CustomId, Button>(); // Кнопки, селекты, модалки и т.п.
client.voiceUsers = new Collection<UserID, Intervals>(); // Кеш пользователей в голосовых каналах
client.subscribes = new Collection<string, any>();



new EventHandlerService(client);
client.login(process.env.TOKEN);
