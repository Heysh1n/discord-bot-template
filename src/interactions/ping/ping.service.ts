import { CommandInteraction, EmbedBuilder } from "discord.js";

export class PingService {
  readonly interaction: CommandInteraction;

  constructor(interaction: CommandInteraction) {
    this.interaction = interaction;
  }

  async generateEmbed() {
    await this.interaction.deferReply();
    const embed = new EmbedBuilder()
      .setTitle("Пинг-Понг Тест:")
      .addFields(
        {
          name: "Пинг Сообщений:",
          value: `> ${String(this.calculateMessagePing())}ms`,
          inline: true,
        },
        {
          name: "Пинг Клиента:",
          value: `> ${this.interaction.client.ws.ping}ms`,
          inline: true,
        },
      );
    return await this.interaction.followUp({ embeds: [embed] });
  }

  private calculateMessagePing() {
    return Math.floor((Date.now() - this.interaction.createdTimestamp) / 1000);
  }
}
