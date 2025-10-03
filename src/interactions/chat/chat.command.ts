import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { ChatService } from "./chat.service";
import { SlashCommandStructure } from '../../common/structure/command.structure';
import { UseGuard } from '../../common/decorators/permissions.decorator';
import { OwnerAccess } from '../../config/permissions.config';

export class chat implements SlashCommandStructure {
  data: any;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('chat')
      .setDescription('Отоброзить панель тех. информации');
  }
  
@UseGuard(OwnerAccess)
  async execute(interaction: CommandInteraction) {
    const chatService = new ChatService(interaction);
    await chatService.execute();
  }
}
