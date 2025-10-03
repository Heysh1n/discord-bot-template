import { ButtonInteraction, GuildMember } from "discord.js";

export async function refreshMainEmbed(interaction: ButtonInteraction, target: GuildMember) {
  try {
    const { ActionService } = await import("../action.service");
    const actionService = new ActionService(interaction, target);

    // Если интеракция уже отвечена — используем editReply
    if (interaction.replied || interaction.deferred) {
      await actionService.execute({ editOnly: true });
    } else {

      await interaction.deferUpdate();
      await actionService.execute({ editOnly: true });
    }

    console.log(`🤡 Embed из ActionService - Перезапущен. ${interaction.user.username}`);
  } catch (err) {
    console.error("[refreshMainEmbed] Ошибка при обновлении главного эмбеда:", err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Ошибка при обновлении эмбеда.", ephemeral: true });
    }
  }
}
