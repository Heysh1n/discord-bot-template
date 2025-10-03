import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder ,
  PermissionFlagsBits,
} from "discord.js";
import { SlashCommandStructure } from "../../common/structure/command.structure";
import { ClearService } from "./prune.service";
import { UseGuard } from "@common/decorators/permissions.decorator";
import {CuratorAccess} from "@config/permissions.config"
export class prune implements SlashCommandStructure {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("prune")
      .setDescription("Очистка канала")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .addIntegerOption(option =>
        option
          .setName("amount")
          .setDescription("Количество сообщений для удаления (1-100)")
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName("duration")
          .setDescription("Временной промежуток (например: 10m, 2h, 1d)")
          .setRequired(false)
      )
      .addUserOption(option =>
        option
          .setName("member")
          .setDescription("Удалить сообщения конкретного участника")
          .setRequired(false)
      );
  }
  @UseGuard(CuratorAccess)
  async execute(interaction: ChatInputCommandInteraction) {
    const clearService = new ClearService(interaction);
    return clearService.handleClear();
  }
}
