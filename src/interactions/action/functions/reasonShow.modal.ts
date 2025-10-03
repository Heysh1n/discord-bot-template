import { ActionRowBuilder, ModalBuilder, TextInputBuilder, ButtonInteraction, MessageFlags } from "discord.js";
import { reasonActionInput } from "@components/global.components";

export async function showReasonModal(interaction: ButtonInteraction, actionId: string) {
    const modal = new ModalBuilder()
        .setCustomId(`reason_${actionId}`)
        .setTitle(`Укажите причину для ${actionId}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                reasonActionInput.setCustomId("action_reason")
            )
        );
    try {
        await interaction.showModal(modal);
    } catch (error) {
        console.error(`[Error] Failed to show modal for ${actionId}:`, error);
        await interaction.followUp({
            content: "❌ Ошибка при открытии модального окна.",
            flags: MessageFlags.Ephemeral,
        }).catch((followUpError) => {
            console.error(`[Error] Failed to send error follow-up for ${actionId}:`, followUpError);
        });
    }
}