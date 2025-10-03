import { Client, TextChannel } from "discord.js";
import kleur from "kleur";
import moment from "moment-timezone";

function log(tag: string, message: string, level: "info" | "warn" | "error" = "info") {
  const date = moment().tz("Europe/Moscow").format("DD.MM.YYYY HH:mm:ss");
  const base = kleur.green(`[${process.env.INSCRIPTION}] -`);
  const time = kleur.yellow(date);
  const tagText = kleur.green(`- [${tag}]`);

  let msg;
  switch (level) {
    case "warn":
      msg = kleur.yellow(message);
      break;
    case "error":
      msg = kleur.red(message);
      break;
    default:
      msg = kleur.green(message);
  }

  console.log(base, time, tagText, msg);
}

export function setupGlobalErrorHandler(client: Client, logChannelId: string) {
  const sendToDiscord = async (tag: string, message: string) => {
    try {
      const channel = await client.channels.fetch(logChannelId);
      if (channel && channel.isTextBased()) {
        (channel as TextChannel).send(
          `🚨 **${tag}:**\n\`\`\`\n${message}\n\`\`\``
        );
      }
    } catch (err) {
      console.error("Не удалось отправить сообщение в Discord:", err);
    }
  };

  process.on("uncaughtException", async (err) => {
    const msg = err.stack || err.message || String(err);
    log("ANTI ERROR", msg, "error");
    await sendToDiscord("ANTI ERROR", msg);
  });

  process.on("unhandledRejection", async (reason) => {
    const msg = reason instanceof Error ? reason.stack || reason.message : String(reason);
    log("ANTI ERROR", msg, "warn");
    await sendToDiscord("ANTI ERROR", msg);
  });

  process.on("warning", async (warning) => {
    const msg = warning.stack || warning.name || String(warning);
    log("WARNING", msg, "warn");
    await sendToDiscord("WARNING", msg);
  });

  log("ANTI ERROR", "Глобальный обработчик ошибок установлен", "info");
}
