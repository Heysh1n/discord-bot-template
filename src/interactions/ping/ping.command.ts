import {
  SlashCommandBuilder,
  CommandInteraction,
} from "discord.js";
import { SlashCommandStructure } from "../../common/structure/command.structure";
import { PingService } from "./ping.service";
import { UseGuard } from "../../common/decorators/permissions.decorator";
import { OwnerAccess } from "../../config/permissions.config";

export class ping implements SlashCommandStructure {
  data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Игра в ping-pong!");
  }
@UseGuard(OwnerAccess)
  async execute(interaction: CommandInteraction) {
    const pingService = new PingService(interaction); 
    return pingService.generateEmbed(); 
  }
}