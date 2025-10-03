import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

// = = = = = = = = = = = = = = BUTTONS = = = = = = = = = = = = = = = =

export const ConfirmCancelButtons = 
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId("confirm")
      .setLabel("✅ Принять"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId("deny")
      .setLabel("❌ Отказать"),
  );
export const ConsiderationButton =
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setCustomId("consideration")
      .setLabel("🤔 Рассмотрение")
  );

  
// export const ticketsStaffButtons =
//   new ActionRowBuilder<ButtonBuilder>().addComponents(
//     new ButtonBuilder()
//       .setStyle(ButtonStyle.Primary)
//       .setCustomId("transcript")
//       .setLabel("📦 Сохранить транскрипт"),
//     new ButtonBuilder()
//       .setStyle(ButtonStyle.Primary)
//       .setCustomId("re-open")
//       .setLabel("🔓 Переоткрыть"),
//     new ButtonBuilder()
//       .setStyle(ButtonStyle.Primary)
//       .setCustomId("delete")
//       .setLabel("🗑️ Удалить")
//   );
// export const ticketsCancelButton =
//   new ActionRowBuilder<ButtonBuilder>().addComponents(
//     new ButtonBuilder()
//       .setStyle(ButtonStyle.Danger)
//       .setCustomId("cancel")
//       .setLabel("🔒 Закрыть")
//   );

export const ActionMainRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("mute")
    .setLabel("Выдать мут")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("unmute")
    .setLabel("Снять мут")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("timeout")
    .setLabel("Выдать отстранение")      
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("remove_timeout")
    .setLabel("Снять отстранение")      
    .setStyle(ButtonStyle.Secondary)
); 

export const ActionUsefulRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("give_warn")
    .setLabel("Выдать предупреждение")      
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("remove_warn")
    .setLabel("Снять предупреждение")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("history")
    .setLabel("История нарушений")
    .setStyle(ButtonStyle.Secondary)
);

export const ActionHeavyRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("ban")
    .setLabel("Забанить")      
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("unban")
    .setLabel("Разбанить")      
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("give_staff_lock")
    .setLabel("Добавить в ЧС состава")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("remove_staff_lock")
    .setLabel("Убрать из ЧС состава")
    .setStyle(ButtonStyle.Secondary)
);

export const ActionWarnsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("give_staff_warn")
    .setLabel("Выдать выговор")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("remove_staff_warn")
    .setLabel("Снять выговор")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("remark")
    .setLabel("Выдать устное замечание")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("unremark")
    .setLabel("Снять устное замечание")
    .setStyle(ButtonStyle.Secondary)
);

export const TimeSelectionRow = (action: "mute" | "ban" | "timeout") =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`${action}_30d`)
      .setLabel("30 дн.")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`${action}_90d`)
      .setLabel("90 дн.")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`${action}_termfree`)
      .setLabel("Бессрочный")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`${action}_select`)
      .setLabel("Выбрать самому")
      .setStyle(ButtonStyle.Secondary)
  );

export const ActionDefaultRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("menu") 
      .setLabel("Главное меню") 
      .setStyle(ButtonStyle.Danger)
  );

// export function ActionDefaultRow(BannerURL: string): ActionRowBuilder<ButtonBuilder> {
//   return new ActionRowBuilder<ButtonBuilder>().addComponents(
//     new ButtonBuilder()
//       .setLabel("Посмотреть баннер")
//       .setStyle(ButtonStyle.Link)
//       .setURL(BannerURL),
// }
    // new ButtonBuilder()
    //   .setCustomId("verification")
    //   .setLabel("Верифицировать")
    //   .setStyle(ButtonStyle.Secondary),
    // new ButtonBuilder()
    //   .setCustomId("give_verify_lock")
    //   .setLabel("Выдать недопуск")
    //   .setStyle(ButtonStyle.Secondary),
    // new ButtonBuilder()
    //   .setCustomId("remove_verify_lock")
    //   .setLabel("Снять недопуск")
    //   .setStyle(ButtonStyle.Secondary),
    // new ButtonBuilder()
    //   .setCustomId("change_gender")
    //   .setLabel("Сменить пол")
    //   .setStyle(ButtonStyle.Primary),
  
// = = = = = = = = = = = = = = SELECT - MENU = = = = = = = = = = = = = = = = 

  
// export const ticketsSelectMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
//     new StringSelectMenuBuilder()
//       .setCustomId("tickets_select")
//       .setPlaceholder("Выберите тип вашего тикета")
//       .addOptions([
//         { label: "⭐ │ Предложение", value: "offer" },
//         { label: "❓ │ Вопрос", value: "question" },
//         { label: "❗ │ Жалоба", value: "report" },
//         { label: "☄️ │ Другое", value: "other" },
//       ])
//   );


// = = = = = = = = = = = = = = MODALS = = = = = = = = = = = = = = = =

export const reasonActionInput = new TextInputBuilder()
  .setCustomId("reason_action")
  .setLabel("Причина действие")
  .setRequired(true)
  .setPlaceholder("Введите причину...")
  .setStyle(TextInputStyle.Short);

export const nicknameAgeInput = new TextInputBuilder()
  .setCustomId("nickname_age")
  .setLabel("Ваш имя и ваш возраст.")
  .setRequired(true)
  .setPlaceholder("Александр | 17 лет...")
  .setStyle(TextInputStyle.Short);

export const aboutInput = new TextInputBuilder()
  .setCustomId("about")
  .setLabel(`Расскажите все о себе.`)
  .setRequired(false)
  .setPlaceholder(
    "Простяк, умею писать код, раньше был на такой работе, у меня есть опыт.."
  )
  .setStyle(TextInputStyle.Paragraph);

// export const titleInput = new TextInputBuilder()
//   .setCustomId('title')
//   .setLabel('Заголовок')
//   .setRequired(true)
//   .setPlaceholder('Ваш ответ...')
//   .setStyle(TextInputStyle.Short);

// export const descriptionInput = new TextInputBuilder()
//   .setCustomId('description')
//   .setLabel('Описание')
//   .setRequired(false)
//   .setPlaceholder(
//     "Ваш ответ..."
//   )
//   .setStyle(TextInputStyle.Paragraph);

// export const colorInput = new TextInputBuilder()
//   .setCustomId('color')
//   .setLabel('Цвет')
//   .setRequired(true)
//   .setPlaceholder('Ваш ответ... (например: #121212)')
//   .setStyle(TextInputStyle.Short);

// export const urlInput = new TextInputBuilder()
//   .setCustomId('url')
//   .setLabel('URL-Ссылка')
//   .setRequired(true)
//   .setPlaceholder('Ваш ответ...')
//   .setStyle(TextInputStyle.Short);

// export const imageInput = new TextInputBuilder()
//   .setCustomId('imageLink')
//   .setLabel('Баннер')
//   .setRequired(false)
//   .setPlaceholder('Ваш ответ... фото или GIF')
//   .setStyle(TextInputStyle.Short);
    