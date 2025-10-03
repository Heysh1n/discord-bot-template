// import {
//   CommandInteraction,
//   ButtonInteraction,
//   GuildMember,
//   ModalBuilder,
//   TextInputBuilder,
//   TextInputStyle,
//   ActionRowBuilder,
// } from "discord.js";
// import { role_ban } from "./../../config/config";
// import { BanModel, BanDocument } from "./../../models/ban.model";
// import {
//   ActionDefualtRow,
//   ActionMainRow,
//   ActionUsefulRow,
//   ActionHeavyRow,
//   ActionWarnsRow,
//   TimeSelectionRow,
// } from "../../config/components/global.components";
// import { CreateUserProfileEmbed } from "@interactions/action/functuions/userResponse.function";

// export async function handleButtonInteraction(interaction: ButtonInteraction) {
//   if (!interaction.guild) {
//     await interaction.reply({
//       content: "Это взаимодействие должно происходить на сервере.",
//       ephemeral: true,
//     });
//     return;
//   }

//   const member = interaction.member;
//   if (!member || !(member instanceof GuildMember)) {
//     await interaction.reply({
//       content: "Участник не найден или не в гильдии.",
//       ephemeral: true,
//     });
//     return;
//   }

//   switch (interaction.customId) {
//     case "ban":
//       await interaction.update({
//         content: "Выберите срок для бана:",
//         embeds: [],
//         components: [TimeSelectionRow],
//       });
//       break;

//     case "30d":
//     case "90d":
//     case "termfree": {
//       await member.roles.add(role_ban);
//       console.log("Роль добавлена...");
//       const userEmbed = await CreateUserProfileEmbed(interaction);

//       await interaction.update({ embeds: [userEmbed], components: [] });
//       console.log("Панель обнавлена...");

//       let durationMs: number | null = null;

//       if (interaction.customId === "30d") durationMs = 30 * 24 * 60 * 60 * 1000;
//       if (interaction.customId === "90d") durationMs = 90 * 24 * 60 * 60 * 1000;
//       if (interaction.customId === "termfree") durationMs = null;

//       const banEntry: BanDocument = new BanModel({
//         MemberID: member.id,
//         GuildID: interaction.guild.id,
//         RoleID: role_ban,
//         ExpiresAt: durationMs ? new Date(Date.now() + durationMs) : null,
//       });

//       await banEntry.save();

//       if (durationMs) {
//         setTimeout(async () => {
//           try {
//             await member.roles.remove(role_ban);
//             await BanModel.deleteOne({ MemberID: member.id, RoleID: role_ban });
//           } catch (err) {
//             console.error("Ошибка при снятии роли или удалении записи:", err);
//           }
//         }, durationMs);
//       }

//       break;
//     }

//     case "select": {
//       const modal = new ModalBuilder()
//         .setCustomId("custom_ban_duration")
//         .setTitle("Выберите срок бана");



//       const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
//         daysInput
//       );
//       modal.addComponents(row);

//       await interaction.showModal(modal);
//       break;
//     }

//     case "menu":
//       await interaction.update({
//         content: "Вы вернулись в меню.",
//         embeds: [],
//         components: [
//           ActionMainRow,
//           ActionUsefulRow,
//           ActionHeavyRow,
//           ActionWarnsRow,
//           ActionDefualtRow
//         ],
//       });
//       break;
//   }
// }


// ---------------------------------------------------------



// import { ActionGuard } from "@decorators/action.permissions.decorator";
// import { FilteredRowsHolder } from "../../types/filtered-rows-holder";
  // filteredRows = [];


    // @ActionGuard([
    //  ActionMainRow,
    //  ActionUsefulRow,
    //  ActionHeavyRow,
    //  ActionWarnsRow,
    //  ActionDefualtRow
    // ])


      // async function handleButtonInteraction(interaction: ButtonInteraction) {
  // if (!interaction.guild) {
  //   await interaction.reply({
  //     content: "Это взаимодействие должно происходить на сервере.",
  //     ephemeral: true,
  //   });
  //   return;
  // }

  // const member = interaction.member;
  // if (!member || !(member instanceof GuildMember)) {
  //   await interaction.reply({
  //     content: "Участник не найден или не в гильдии.",
  //     ephemeral: true,
  //   });
  //   return;
  // }

  // switch (interaction.customId) {
  //   case "ban":
  //     await interaction.update({
  //       content: "Выберите срок для бана:",
  //       embeds: [],
  //       components: [TimeSelectionRow],
  //     });
  //     break;

  //   case "30d":
  //   case "90d":
  //   case "termfree": {
  //     await member.roles.add(role_ban);
  //     console.log("Роль добавлена...");
  //     const userEmbed = await CreateUserProfileEmbed(interaction);

  //     await interaction.update({ embeds: [userEmbed], components: [] });
  //     console.log("Панель обнавлена...");

  //     let durationMs: number | null = null;

  //     if (interaction.customId === "30d") durationMs = 30 * 24 * 60 * 60 * 1000;
  //     if (interaction.customId === "90d") durationMs = 90 * 24 * 60 * 60 * 1000;
  //     if (interaction.customId === "termfree") durationMs = null;

  //     const banEntry: BanDocument = new BanModel({
  //       MemberID: member.id,
  //       GuildID: interaction.guild.id,
  //       RoleID: role_ban,
  //       ExpiresAt: durationMs ? new Date(Date.now() + durationMs) : null,
  //     });

  //     await banEntry.save();

  //     if (durationMs) {
  //       setTimeout(async () => {
  //         try {
  //           await member.roles.remove(role_ban);
  //           await BanModel.deleteOne({ MemberID: member.id, RoleID: role_ban });
  //         } catch (err) {
  //           console.error("Ошибка при снятии роли или удалении записи:", err);
  //         }
  //       }, durationMs);
  //     }

  //     break;
  //   }

  //   case "select": {
  //     const modal = new ModalBuilder()
  //       .setCustomId("custom_ban_duration")
  //       .setTitle("Выберите срок бана");
  //     const row = new ActionRowBuilder<TextInputBuilder>().addComponents(daysInput);
  //     modal.addComponents(row);

  //     await interaction.showModal(modal);
  //     break;
  //   }

  //   case "menu":
  //     await interaction.update({
  //       content: "Вы вернулись в меню.",
  //       embeds: [],
  //       components: [
  //         ActionMainRow,
  //         ActionUsefulRow,
  //         ActionHeavyRow,
  //         ActionWarnsRow,
  //         ActionDefualtRow
  //       ],
  //     });
  //     break;
  // }
  // }