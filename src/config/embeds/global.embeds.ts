import { GuildMember, EmbedBuilder, ActivityType } from "discord.js";
import { hiddenRoles } from "@config/config"

// ----------- STATIC EMBEDS -----------

export const HighUserPermission = new EmbedBuilder()
  .setColor("DarkRed")
  .setTitle("🛡️ Этот пользователь имеет иммунитет 🛡️")
  .setDescription("**Я не могу взаимодействовать с этим пользователем.**");


// export const mediaEmbedDeny = new EmbedBuilder()
//     .setTitle(`❌ | Ваша заявка была отклонена!`)
//     .setColor("Red")
//     .setFooter({
//       text: `Спасибо вам за проявленный интерес! 😘`
//     })ц
//     .setDescription(`
//       > **Ваша заявка была отклонена, возможно вы ошиблись в при подаче заявки. 🤔**
//     `)
//   .setImage('https://i.imgur.com/01CDedR.png');
// export const mediaEmbedAccept = new EmbedBuilder()
//     .setTitle(`✅ | Ваша заявка была принята!`)
//     .setColor("Green")
//     .setFooter({
//       text: `Добро пожаловать на борт! 🤩 `
//     })
//     .setDescription(`
//       > **Поздравляю! Ваша заявка была принята. 🎉**
//     `)
//     .setImage('https://i.imgur.com/pvetRC1.png');

// export const mediaEmbedWait = new EmbedBuilder()
//     .setTitle(`❔ | Ваша заявка на рассмотрении!`)
//     .setColor("White")
//     .setFooter({
//       text: `Пожалуйста, ожидайте дальнейших новостей. 🤗`
//     })
//     .setDescription(`
//       > **Мы увидели вашу заявку! В настоящее время мы рассматриваем заявку. 😋**
//     `)
//     .setImage('https://i.imgur.com/xsXpIzG.png');

// ----------- DYNAMIC EMBEDS -----------

export function CooldownEmbed(cooldownTime: string) {
  return (
    new EmbedBuilder()
      .setTitle("⏳ Подождите")
      .setDescription(
        `Пожалуйста, подождите **${cooldownTime}** перед повторной подачей заявки.`
      )
      // .setImage('https://i.imgur.com/LBzVWtd.jpeg')
      .setColor("#ea473f")
      .setFooter({
        text: "Система заявок",
        iconURL: "https://i.imgur.com/7rVVxSH.png",
      })
      .setTimestamp()
  );
}


export function MainUserEmbed(
  member: GuildMember, 
  devices: Record<string, string> | null, 
  onVoice: string, 
  requester: GuildMember, 
  userData?: any) {
  const user = member.user;
  const guild = member.guild;
  const UserMention = `${user}`;
  const DateCreated = `> <t:${Math.floor(user.createdTimestamp / 1000)}:R>`;
  const DateJoined = `> <t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`;
  const roleColor = member.displayHexColor === "#000000" ? "#2f3136" : member.displayHexColor;

  // ===== Роли =====
  const filteredRoles = member.roles.cache
    .filter(r => r.id !== guild.id && !hiddenRoles.includes(r.id))
    .map(r => r.toString());

  let roles: string;
  if (filteredRoles.length === 0) roles = "❌ Нет ролей";
  else if (filteredRoles.length > 4) {
    const shown = filteredRoles.slice(0, 4).join(", ");
    const more = filteredRoles.length - 4;
    roles = `${shown} и ещё ${more}`;
  } else roles = filteredRoles.join(",");

  // ===== Статус =====
  const statusMap: Record<string, string> = {
    online: "> 🟢 В сети",
    idle: "> 🌙 Неактивен",
    dnd: "> ⛔ Не беспокоить",
    offline: "> ⚫ Не в сети",
    invisible: "> 👻 Невидимка",
  };
  const presenceStatus = member.presence?.status || "offline";
  const userStatus = statusMap[presenceStatus];

  // ===== Активность =====
  let activityText = "> ❌ Нет";
  const activity = member.presence?.activities[0];
  if (activity) {
    switch (activity.type) {
      case ActivityType.Playing:
        activityText = `> 🎮 Играет в **${activity.name}**`;
        break;
      case ActivityType.Listening:
        if (activity.name === "Spotify" && activity.details && activity.state) {
          activityText = `> 🎵 Слушает **${activity.state} — ${activity.details}**`;
        } else {
          activityText = `> 🎵 Слушает **${activity.name}**`;
        }
        break;
      case ActivityType.Custom:
        activityText = activity.state
          ? `> 🛑 ${activity.state}`
          : "> 🛑 Кастомная активность";
        break;
      default:
        activityText = `> ✅ ${activity.name}`;
        break;
    }
  }

  // ===== Устройства =====
  const sessionMap: Record<string, string> = {
    desktop: "> 💻 Десктоп",
    mobile: "> 📱 Телефон",
    web: "> 🌐 Браузер",
  };
  const sessionTypes = devices
    ? Object.keys(devices)
      .map(device => sessionMap[device] || "> ❓ Неизвестное устройство")
      .join(", ")
    : "> ⚫ Не в сети";

  // ===== ЧС стаффа =====
  const isBlocked = userData?.staffLocked ? "💀 Есть" : "✅ Нет";

  // ===== Формирование Embed =====
  return new EmbedBuilder()
    .setThumbnail(user.displayAvatarURL())
    .setColor(roleColor)
    .setAuthor({
      name: `Панель действий`,
      iconURL: guild.iconURL() ?? undefined,
    })
    .setTitle(`Пользователь — ${user.tag}`)
    .setDescription(`
      **Тэг:** ${UserMention}
      **ID:** \`${user.id}\`
        **Роли:** ${roles}
      **ЧС Стаффа:** ${isBlocked}
    `)
    .addFields(
      { name: "Присоединился", value: DateJoined, inline: true },
      { name: "Аккаунт создан", value: DateCreated, inline: true },
      { name: "Голосовой канал", value: onVoice, inline: true },
      { name: "Устройство", value: sessionTypes, inline: true },
      { name: "Статус", value: userStatus, inline: true },
      { name: "Активность", value: activityText, inline: true },
    )
    .setFooter({
      text: `Запрос от ${requester.user.username}`,
      iconURL: requester.user.displayAvatarURL() ?? undefined,
    })
    .setTimestamp();
}
