import {
  ChatInputCommandInteraction,
  ButtonInteraction,
  GuildMember,
} from "discord.js";
import fs from "fs";
import path from "path";
import { MainUserEmbed } from "@embeds/global.embeds";

export async function CreateUserProfileEmbed(
  interaction: ChatInputCommandInteraction | ButtonInteraction, // теперь оба типа
  member?: GuildMember
) {
  // Если member передали явно — берём его, иначе ищем сами
  const targetMember =
    member ??
    (interaction instanceof ButtonInteraction
      ? (interaction.guild?.members.cache.get(interaction.user.id) as GuildMember)
      : (interaction.options.get("user")?.member as GuildMember));

  if (!targetMember) throw new Error("❌ Пользователь не найден.");

  // ===== Голосовой канал =====
  const onVoice = targetMember.voice?.channel
    ? `> - **[${targetMember.voice.channel.name}](https://discord.com/channels/${targetMember.guild.id}/${targetMember.voice.channel.id})**`
    : "> *Не в голосовом канале*";

  // ===== Статус устройств =====
  const rawDevices = targetMember.presence?.clientStatus ?? null;
  const devices = rawDevices
    ? Object.fromEntries(
        Object.entries(rawDevices).map(([d, s]) => [d, String(s)])
      )
    : null;

  // ===== Чтение users.json =====
  const usersPath = path.join(__dirname, "../../../config/db/users.json");
  let usersData: Record<string, any> = {};
  try {
    const rawData = fs.readFileSync(usersPath, "utf-8");
    usersData = rawData ? JSON.parse(rawData) : {};
  } catch (err) {
    console.error("Ошибка чтения users.json:", err);
    usersData = {};
  }
  const userData = usersData[targetMember.id] || {};

  // ===== Эмбед =====
  return MainUserEmbed(
    targetMember,
    devices,
    onVoice,
    interaction.member as GuildMember,
    userData
  );
}
