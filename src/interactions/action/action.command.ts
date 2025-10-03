import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { SlashCommandStructure } from "@common/structure/command.structure";
import { ActionService } from "./action.service";

export class action implements SlashCommandStructure {
  data: any;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("action")
      .setDescription("Вызвать панель взаимодействия")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Пользователь")
          .setRequired(true)
      );
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.get("user")?.member as GuildMember;

    if (!target) {
      return interaction.reply({
        content: "❌ Пользователь не найден.",
        ephemeral: true,
      });
    }

    const actionservice = new ActionService(interaction, target);
    return actionservice.execute();
  }
}
