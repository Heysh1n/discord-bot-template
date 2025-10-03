import { InteractionCollector, ButtonInteraction, ModalSubmitInteraction, ComponentType, MessageFlags } from "discord.js";

export async function getReasonFromModal(interaction: ButtonInteraction, actionId: string): Promise<string | undefined> {
    return new Promise((resolve) => {
        const collector = new InteractionCollector<ModalSubmitInteraction>(interaction.client, {
            time: 300_000,
            filter: (i) => i.customId === `reason_${actionId}` && i.user.id === interaction.user.id,
        });
        if (!collector) {
            resolve(undefined);
            return;
        }

        collector.on("collect", async (modalInteraction: ModalSubmitInteraction) => {
            try {
                const reason = modalInteraction.fields.getTextInputValue("action_reason")?.trim();
                if (!reason) {
                    await modalInteraction.reply({
                        content: "❌ Причина не указана.",
                        flags: MessageFlags.Ephemeral,
                    });
                    resolve(undefined);
                    return;
                }
                await modalInteraction.reply({
                    content: "✅ Причина принята.",
                    flags: MessageFlags.Ephemeral,
                });
                resolve(reason);
            } catch (error) {
                console.error(`[Error] Failed to process modal submission for ${actionId}, interaction=${modalInteraction.id}:`, error);
                await modalInteraction.reply({
                    content: "❌ Ошибка при обработке причины.",
                    flags: MessageFlags.Ephemeral,
                }).catch((replyError) => {
                    console.error(`[Error] Failed to reply to modal submission for ${actionId}:`, replyError);
                });
                resolve(undefined);
            }
        });

        collector.on("end", (_, reason) => {
            if (reason === "time") {
                resolve(undefined);
            }
        });
    });
}