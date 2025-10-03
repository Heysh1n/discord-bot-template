import {
    ButtonInteraction,
    GuildMember,
    CacheType,
} from "discord.js";
import { LocalDB } from "@migrations/localdb.service";
import { role_LocalBan, role_LocalMute } from "@config/config";
import { refreshMainEmbed } from "./refreshMainEmbed.function";
import { handleHistoryButton } from "./historyButtons";
import { waitForTimeSelection } from "./multiStepTime.function";
import { ActionCache } from "@migrations/localCache.service";
import { canActOn } from "./hierarchy.system";
import { showReasonModal } from "./reasonShow.modal";
import { getReasonFromModal } from "./reasonGet.modal";

type HandlerFunc = (
    interaction: ButtonInteraction<CacheType>,
    target: GuildMember,
    executor: GuildMember,
    customReason?: string
) => Promise<void>;

export class ActionButtonHandler {
    private static timeActionPrefixes = ['mute', 'ban', 'timeout'];

    private static handlers: Record<string, HandlerFunc> = {
        menu: async (interaction, target, executor) => {
            const { ActionService } = await import("../action.service");
            const actionService = new ActionService(interaction, target);
            await actionService.execute();
        },

        history: async (interaction, target) => {
            await handleHistoryButton(interaction, target.id);
        },

        unmute: async (interaction, target, executor) => {
            await target.roles.remove(role_LocalMute).catch(() => null);
            LocalDB.removeMute(target.id);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ ${target.user.tag} размучен` });
        },

        remove_timeout: async (interaction, target, executor) => {
            await target.timeout(null).catch(() => null);
            LocalDB.removeTimeout(target.id);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ Отстранение снято для ${target.user.tag}` });
        },

        unban: async (interaction, target, executor) => {
            await target.roles.remove(role_LocalBan).catch(() => null);
            LocalDB.removeBan(target.id);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ ${target.user.tag} разбанен` });
        },

        give_warn: async (interaction, target, executor, customReason = "Выдано предупреждение") => {
            LocalDB.addWarn(target.id, {
                type: "warn",
                reason: customReason,
                moderator: executor.user.tag,
                date: new Date().toISOString(),
            }, target.user.tag);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ Предупреждение выдано для ${target.user.tag}` });
        },

        remove_warn: async (interaction, target, executor) => {
            LocalDB.removeLastWarn(target.id);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ Последнее предупреждение удалено у ${target.user.tag}` });
        },

        give_staff_warn: async (interaction, target, executor, customReason = "Выговор стаффу") => {
            LocalDB.addStaffWarn(target.id, {
                type: "staff_warn",
                reason: customReason,
                moderator: executor.user.tag,
                date: new Date().toISOString(),
            }, target.user.tag);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ Выговор стаффу ${target.user.tag} выдан` });
        },

        remove_staff_warn: async (interaction, target, executor) => {
            LocalDB.removeLastStaffWarn(target.id);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ Последний выговор стаффу ${target.user.tag} удалён` });
        },

        remark: async (interaction, target, executor, customReason = "Добавлено замечание") => {
            LocalDB.addRemark(target.id, {
                type: "remark",
                reason: customReason,
                moderator: executor.user.tag,
                date: new Date().toISOString(),
            }, target.user.tag);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ Замечание добавлено для ${target.user.tag}` });
        },

        unremark: async (interaction, target, executor) => {
            LocalDB.removeLastRemark(target.id);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ Последнее замечание удалено для ${target.user.tag}` });
        },

        give_staff_lock: async (interaction, target, executor, customReason = "Добавлен в ЧС стаффа") => {
            LocalDB.addStaffLockHistory(target.id, {
                action: "add_lock",
                reason: customReason,
                moderator: executor.user.tag,
                dateStart: new Date().toISOString(),
                dateEnd: "",
            }, target.user.tag);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ Пользователь ${target.user.tag} добавлен в ЧС стаффа` });
        },

        remove_staff_lock: async (interaction, target, executor, customReason ) => {
            LocalDB.addStaffLockHistory(target.id, {
                action: "remove_lock",
                reason: customReason,
                moderator: executor.user.tag,
                dateStart: new Date().toISOString(),
                dateEnd: "",
            }, target.user.tag);
            await refreshMainEmbed(interaction, target).catch(() => null);
            await interaction.editReply({ content: `✅ Пользователь ${target.user.tag} убран из ЧС стаффа` });
        },
    };

    static async handle(interaction: ButtonInteraction<CacheType>) {
        const executor = interaction.member as GuildMember;
        const actionId = interaction.customId;
        const targetId = ActionCache.get(interaction.message.id);

        if (!targetId) {
            return interaction.editReply?.({ content: "❌ Не могу найти цель для действия." });
        }

        const target = interaction.guild?.members.cache.get(targetId);
        if (!target) {
            return interaction.editReply?.({ content: "❌ Пользователь не найден." });
        }

        const check = await canActOn(executor, target, interaction);
        if (!check.success) {
            return;
        }

        LocalDB.createUser(target.id, target.user.tag);

        try {
            // Handle time-based actions (reason modal handled in waitForTimeSelection for mute)
            const isTimeAction = this.timeActionPrefixes.some(prefix =>
                actionId.startsWith(prefix + '_') || actionId === prefix
            );
            if (isTimeAction) {
                await waitForTimeSelection(interaction, target, executor);
                return refreshMainEmbed(interaction, target).catch(() => null);
            }

            // Handle actions that need custom reasons via modal
            const needsReasonModal = ['give_staff_lock', 'remove_staff_lock', 'give_warn', 'give_staff_warn', 'remark'];
            let customReason: string | undefined;
            if (needsReasonModal.includes(actionId)) {
                await showReasonModal(interaction, actionId);
                customReason = await getReasonFromModal(interaction, actionId);
                if (!customReason) {
                    await interaction.editReply({ content: "❌ Действие отменено: причина не указана." });
                    return;
                }
            }

            // Handle specific actions via map
            const handler = this.handlers[actionId];
            if (handler) {
                await handler(interaction, target, executor, customReason);
                return;
            }

            // Default fallback
            return interaction.editReply({ content: "❌ Неизвестная кнопка." });
        } catch (err) {
            console.error("Ошибка при обработке кнопки:", err);
            const errorMessage = { content: "❌ Ошибка при выполнении действия." };
            if (!interaction.replied) {
                await interaction.reply({ ...errorMessage, ephemeral: true }).catch(() => null);
            } else {
                await interaction.editReply(errorMessage).catch(() => null);
            }
        }
    }
}
