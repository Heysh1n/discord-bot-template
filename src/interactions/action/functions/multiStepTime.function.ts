import { ButtonInteraction, GuildMember, TextChannel, ComponentType, MessageFlags } from "discord.js";
import { DURATION_MAP, formatPunishmentMessage, parseDuration } from "./timeActions.function";
import { role_LocalBan, role_LocalMute } from "@config/config";
import { LocalDB } from "@migrations/localdb.service";
import { refreshMainEmbed } from "./refreshMainEmbed.function";
import { showReasonModal } from "./reasonShow.modal";
import { getReasonFromModal } from "./reasonGet.modal";

async function safeEdit(interaction: ButtonInteraction, options: any) {
    try {
        if (interaction.deferred || interaction.replied) {
            return await interaction.editReply(options);
        } else {
            return await interaction.update(options);
        }
    } catch {
        return null;
    }
}

async function applyPunishment(
    action: "mute" | "ban" | "timeout",
    target: GuildMember,
    executor: GuildMember,
    durationMs: number,
    interaction: ButtonInteraction,
    reason: string = "Не указана причина"
) {
    const endDate = new Date(Date.now() + durationMs);

    LocalDB.createUser(target.id, target.user.tag);

    switch (action) {
        case "mute":
            LocalDB.addMuteHistory(target.id, {
                action,
                reason,
                moderator: executor.user.tag,
                dateStart: new Date().toISOString(),
                dateEnd: endDate.toISOString(),
            }, target.user.tag);
            await target.roles.add(role_LocalMute).catch((error) => {
                console.error(`[Error] Failed to add mute role for ${target.id}:`, error);
            });
            break;
        case "ban":
            LocalDB.addBanHistory(target.id, {
                action,
                reason,
                moderator: executor.user.tag,
                dateStart: new Date().toISOString(),
                dateEnd: endDate.toISOString(),
            }, target.user.tag);
            await target.roles.add(role_LocalBan).catch((error) => {
                console.error(`[Error] Failed to add ban role for ${target.id}:`, error);
            });
            break;
        case "timeout":
            LocalDB.addTimeoutHistory(target.id, {
                action,
                reason,
                moderator: executor.user.tag,
                dateStart: new Date().toISOString(),
                dateEnd: endDate.toISOString(),
            }, target.user.tag);
            const maxDiscordTimeout = 28 * 24 * 60 * 60 * 1000;
            const applyDuration = Math.min(durationMs, maxDiscordTimeout);
            await target.timeout(applyDuration, reason).catch((error) => {
                console.error(`[Error] Failed to apply timeout for ${target.id}:`, error);
            });
            LocalDB.setTimeoutEndDate(target.id, endDate.toISOString(), target.user.tag);
            break;
    }

    await safeEdit(interaction, {
        content: formatPunishmentMessage(action, target.user.tag, endDate, durationMs, reason),
        components: [],
    });
}

export async function waitForTimeSelection(
    interaction: ButtonInteraction,
    target: GuildMember,
    executor: GuildMember
) {

    const [rawAction] = interaction.customId.split("_");
    if (!["mute", "ban", "timeout"].includes(rawAction)) {
        await safeEdit(interaction, { content: "❌ Некорректное действие.", components: [] });
        return refreshMainEmbed(interaction, target);
    }
    const action = rawAction as "mute" | "ban" | "timeout";
    const { TimeSelectionRow } = await import("@components/global.components");

    await safeEdit(interaction, {
        content: `Выберите срок для **${action}**:`,
        components: [TimeSelectionRow(action)],
    });

    const collector = (interaction.channel as TextChannel)?.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id === executor.id && i.customId.startsWith(action),
        max: 1,
        time: 120_000,
    });

    if (!collector) {
        await safeEdit(interaction, { content: "❌ Не удалось создать коллектор.", components: [] });
        return refreshMainEmbed(interaction, target);
    }

    return new Promise<void>((resolve) => {
        collector.on("collect", async (i: ButtonInteraction) => {
            const [, durationKey] = i.customId.split("_");
            let durationMs: number | undefined;

            // Show modal for mute or timeout before updating embed
            let reason: string | undefined;
            if (action === "mute" || action === "timeout" || action === "ban") {
                await showReasonModal(i, action);
                reason = await getReasonFromModal(i, action);
                if (!reason) {
                    await safeEdit(i, {
                        content: "❌ Действие отменено: причина не указана.",
                        components: [],
                    });
                    await refreshMainEmbed(i, target);
                    return resolve();
                }
            }

            // Update embed with new duration selection buttons
            await safeEdit(i, {
                content: `Подтвердите срок для **${action}** (выбрано: ${durationKey === "termfree" ? "Бессрочный" : durationKey === "select" ? "Пользовательский" : durationKey}):`,
                components: [TimeSelectionRow(action)], // Reuse TimeSelectionRow; replace with new ActionRowBuilder if needed
            });

            if (durationKey === "select") {
                await safeEdit(i, {
                    content: `⏳ Напишите срок действия для **${action}** в этом канале (например: 10m, 2h, 1d)`,
                    components: [],
                });

                const textCollector = (i.channel as TextChannel).createMessageCollector({
                    filter: (m) => m.author.id === executor.id,
                    max: 1,
                    time: 60_000,
                });

                textCollector.on("collect", async (msg) => {
                    const input = msg.content.trim();
                    durationMs = parseDuration(input);
                    await msg.delete().catch((error) => {
                        console.error(`[Error] Failed to delete message for ${msg.id}:`, error);
                    });

                    if (durationMs === undefined) {
                        await safeEdit(i, {
                            content: "❌ Неверный формат времени. Примеры: `10m`, `2h`, `1d`",
                            components: [],
                        });
                        await refreshMainEmbed(i, target);
                        return resolve();
                    }

                    await applyPunishment(action, target, executor, durationMs, i, reason);
                    await refreshMainEmbed(i, target);
                    resolve();
                });

                textCollector.on("end", async (_, reason) => {
                    if (reason === "time") {
                        await safeEdit(i, {
                            content: "⏱ Время ввода истекло. Возвращаем на главное меню.",
                            components: [],
                        });
                        await refreshMainEmbed(i, target);
                        resolve();
                    }
                });
            } else {
                if (!DURATION_MAP[durationKey] && durationKey !== "termfree") {
                    await safeEdit(i, {
                        content: `❌ Некорректный срок: ${durationKey}.`,
                        components: [],
                    });
                    await refreshMainEmbed(i, target);
                    return resolve();
                }

                durationMs = durationKey === "termfree" ? 100 * 365 * 24 * 60 * 60 * 1000 : DURATION_MAP[durationKey];
                await applyPunishment(action, target, executor, durationMs, i, reason);
                await refreshMainEmbed(i, target);
                resolve();
            }
        });

        collector.on("end", async (_, reason) => {
            if (reason === "time") {
                await safeEdit(interaction, {
                    content: "⏱ Время выбора истекло.",
                    components: [],
                });
                await refreshMainEmbed(interaction, target);
                resolve();
            }
        });
    });
}