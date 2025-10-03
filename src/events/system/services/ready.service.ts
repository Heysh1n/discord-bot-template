import {
  Client,
  Guild,
  REST,
  Routes,
  VoiceBasedChannel
} from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import InteractionCollector from "../collectors/interaction.collector";
import { logger } from "@common/decorators/logFunction.decorator";
import kleur = require("kleur");
import moment from "moment-timezone";
import { connectToDb } from "@functions/connectToDb";
import {
  BotStatus,
  BotTextStatus,
  BotActivityType,
  BotStatusURL,
  VoiceOn,
  channel_voiceConnection,
  channel_Errors
} from "@config/config";
import { ActionCache } from "@migrations/localCache.service";
import { LocalDB } from "@migrations/localdb.service";
import { setupGlobalErrorHandler } from "@events/system/services/errorHandler.function";

export class EventReadyService {
  constructor(
    private readonly client: Client,
    private readonly interactionCollector: InteractionCollector = new InteractionCollector(
      client
    )
  ) { }

  /** Унифицированный лог */
  private log(tag: string, message: string) {
    console.log(
      kleur.green(`[${process.env.INSCRIPTION}] -`),
      kleur.yellow(moment().tz("Europe/Moscow").format("D.M.YYYY HH:mm:ss")),
      kleur.green(`- [${tag}]`),
      message
    );
  }

  @logger(`Действия с командами начаты...`, `Действия с командами закончены`)
  public async commandActions(): Promise<void> {
    try {
      await this.collectInteractions();
      await this.cmdRegister(this.client);
      await this.setBotStatus();
      await this.autoVoiceConnect();
      await this.cleanupOnStart();
      await this.startTimeoutManager();
      await setupGlobalErrorHandler(this.client, channel_Errors);
    } catch (error) {
      console.error("Ошибка при выполнении commandActions:", error);
    }
  }

  @logger(`Начинаю регистрацию команд`, `Закончил регистрацию команд`)
  protected async cmdRegister(client: Client) {
    try {
      const rest = new REST().setToken(process.env.TOKEN || "your_token_here");
      const commands = client.commands?.map((command) => command.data.toJSON());

      if (!commands) {
        throw new Error("Нет команд для регистрации");
      }

      const commandData: any = await rest.put(
        Routes.applicationCommands(client.user?.id || "your_client_id_here"),
        { body: commands }
      );

      this.log("CMD", `все команды зарегистрированы. Количество команд: ${commandData.length}`);
    } catch (err) {
      console.error("Ошибка при регистрации команд:", err);
    }
  }

  @logger(`Начинаю сбор всех взаимодействий`, `Закончил сбор всех взаимодействий`)
  protected async collectInteractions() {
    try {
      await this.interactionCollector.collect();
    } catch (error) {
      console.error("Ошибка при сборе взаимодействий:", error);
    }
  }

  @logger(`Начинаю выполнять действия с каждой гильдией`, `Заканчиваю выполнять действия с каждой гильдией`)
  public async allGuilds() {
    const guilds = this.client.guilds.cache;
    for (const guild of guilds) {
      const thisGuild = guild[1];
      await this.collectAllUsers(thisGuild);
    }
  }

  @logger(`Начинаю собирать всех пользователей со всех серверов в БД`, `Закончил сбор всех пользователей со всех серверов в БД`)
  protected async collectAllUsers(guild: Guild): Promise<void> {
    try {
      const members = await guild.members.fetch();
      members.forEach((member) => {
        this.client.voiceUsers?.set(member.id, member);
      });
    } catch (error) {
      console.error(`Ошибка при сборе пользователей для гильдии ${guild.id}:`, error);
    }
  }

  @logger(`Подключаюсь к БД`, `Подключился к БД`)
  public async dbConnect() {
    try {
      await connectToDb();
      this.log("DB", `Подключение к БД успешно`);
    } catch (error) {
      console.error("Ошибка при подключении к БД:", error);
    }
  }

  @logger(`Устанавливаю статус бота`, `Статус бота установлен`)
  public async setBotStatus() {
    try {
      this.client.user?.setPresence({
        status: BotStatus,
        activities: [
          {
            name: BotTextStatus,
            type: BotActivityType,
            url: BotStatusURL,
          },
        ],
      });

      this.log("STATUS", `Статус установлен: ${BotTextStatus}`);
    } catch (error) {
      console.error("Ошибка при установке статуса бота:", error);
    }
  }

  @logger(`Подключаюсь в голосовой канал`, `Подключение в голосовой канал завершено`)
  private async autoVoiceConnect() {
    try {
      if (!VoiceOn) return;

      const channel = this.client.channels.cache.get(
        channel_voiceConnection
      ) as VoiceBasedChannel;

      if (!channel || !channel.isVoiceBased()) {
        console.warn("[VOICE] Канал не найден или не является голосовым.");
        return;
      }

      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: false,
      });

      this.log("VOICE", `Подключился в голосовой канал: ${channel.name}`);
    } catch (error) {
      console.error("[VOICE] Ошибка при подключении в голос:", error);
    }
  }

  @logger(`Чищу кеш и локальную БД`, `Чистка завершена`)
  public async cleanupOnStart() {
    try {
      ActionCache.clear();
      LocalDB.cleanup();
      this.log("CLEANUP", `Кеш и локальная БД очищены`);
    } catch (error) {
      console.error("[CLEANUP] Ошибка при очистке:", error);
    }
  }

@logger(`Запускаю менеджер долгих таймаутов`, `Менеджер таймаутов запущен`)
private async startTimeoutManager() {
  try {
    setInterval(async () => {
      const allUsers = LocalDB.getAllUsers();
      const now = Date.now();
      const guild = this.client.guilds.cache.first();
      if (!guild) return;

      for (const [userId, user] of Object.entries(LocalDB.getAllUsersMap())) {
        if (!user.timeoutEndDate) continue;

        const endDate = new Date(user.timeoutEndDate).getTime();
        if (now >= endDate) continue; // срок прошёл

        const member = await guild.members.fetch(userId).catch(() => null);
        if (!member) continue;

        // Если у юзера нет активного таймаута, а дата окончания ещё в будущем
        if (!member.communicationDisabledUntil || member.communicationDisabledUntil.getTime() < now) {
          const remaining = endDate - now;
          const maxDiscordTimeout = 28 * 24 * 60 * 60 * 1000;
          const applyDuration = Math.min(remaining, maxDiscordTimeout);

          await member.timeout(applyDuration, "Автопродление таймаута").catch(() => null);
          console.log(`[TIMEOUT_MANAGER] Продлил таймаут ${member.user.tag} на ${applyDuration / 1000 / 60} мин.`);
        }
      }
    }, 12 * 60 * 60 * 1000); // проверка каждые 12ч
  } catch (error) {
    console.error("[TIMEOUT_MANAGER] Ошибка:", error);
  }
}




}
