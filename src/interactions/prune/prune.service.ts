import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  TextChannel,
} from "discord.js";

export class ClearService {
  readonly interaction: ChatInputCommandInteraction;

  constructor(interaction: ChatInputCommandInteraction) {
    this.interaction = interaction;
  }

  async handleClear() {
    const amount = this.interaction.options.get("amount")?.value as number;
    const duration = this.interaction.options.get("duration")?.value as string;
    const member = this.interaction.options.getUser("member");

    if (!this.interaction.channel || !(this.interaction.channel instanceof TextChannel)) {
      return this.interaction.reply({
        content: "❌ Эту команду можно использовать только в текстовых каналах.",
        ephemeral: true,
      });
    }

    if (amount < 1 || amount > 100) {
      return this.interaction.reply({
        content: "❌ Укажите количество сообщений от 1 до 100.",
        ephemeral: true,
      });
    }

    let minTimestamp: number | null = null;
    if (duration) {
      const match = duration.match(/(\d+)([smhd])/); // секунды, минуты, часы, дни
      if (match) {
        const num = parseInt(match[1]);
        const unit = match[2];
        let ms = 0;

        switch (unit) {
          case "s": ms = num * 1000; break;
          case "m": ms = num * 60 * 1000; break;
          case "h": ms = num * 60 * 60 * 1000; break;
          case "d": ms = num * 24 * 60 * 60 * 1000; break;
        }

        minTimestamp = Date.now() - ms;
      }
    }

    const messages = await this.interaction.channel.messages.fetch({ limit: amount });
    let filtered = messages;

    if (member) {
      filtered = filtered.filter(m => m.author.id === member.id);
    }

    if (minTimestamp) {
      filtered = filtered.filter(m => m.createdTimestamp >= minTimestamp);
    }

    await this.interaction.channel.bulkDelete(filtered, true).catch(() => null);

    return this.interaction.reply({
      content: `✅ Удалено ${filtered.size} сообщений.`,
      flags: MessageFlags.Ephemeral
    });
  }
}
