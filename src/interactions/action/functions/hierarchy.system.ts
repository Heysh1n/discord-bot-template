import {
    GuildMember,
    CommandInteraction,
    Message,
    ButtonInteraction,
} from "discord.js";
import { hierarchyRoles } from "@config/config";
import { HighUserPermission } from "@embeds/global.embeds";

export interface HierarchyCheckResult {
    success: boolean;
    reason?: string;
    readableReason?: string;
}

export async function canActOn(
    executor: GuildMember,
    target: GuildMember,
    interaction: CommandInteraction | Message | ButtonInteraction
): Promise<HierarchyCheckResult> {
    if (!executor || !target) {
        return fail(interaction, "executor_or_target_missing", "❌ Ошибка: исполнитель или цель не найдены.");
    }

    // Попытка действовать на самого себя
    if (executor.id === target.id) {
        const msg = "❌ Нельзя действовать на самого себя.";
        return fail(interaction, "self_action", msg);
    }

    // Определение индексов в иерархии
    const executorIndex = getRoleIndex(executor);
    const targetIndex = getRoleIndex(target);

    const canAct = executorIndex < targetIndex;

    if (!canAct) {
        const msg = "❌ У вас нет прав действовать на этого пользователя.";
        return fail(interaction, "target_higher", msg);
    }

    return { success: true };
}

function getRoleIndex(member: GuildMember): number {
    const roleIndexes = member.roles.cache
        .map(r => hierarchyRoles.indexOf(r.id))
        .filter(idx => idx !== -1);

    return roleIndexes.length > 0 ? Math.min(...roleIndexes) : hierarchyRoles.length;
}

async function fail(
    interaction: CommandInteraction | Message | ButtonInteraction,
    reason: string,
    readableReason: string
): Promise<HierarchyCheckResult> {
    await replaceEmbedWithHighPermission(interaction, readableReason);
    return { success: false, reason, readableReason };
}

// Универсальная функция замены эмбеда и удаления кнопок без if/else
async function replaceEmbedWithHighPermission(
    interaction: CommandInteraction | Message | ButtonInteraction,
    reason: string
) {
    try {
        if ("deferred" in interaction && !interaction.deferred && !interaction.replied) {
            await interaction.deferReply({ ephemeral: true }).catch(() => null);
        }

        const actionMap: Record<string, () => Promise<any>> = {
            ButtonInteraction: () =>
                (interaction as ButtonInteraction).update({
                    embeds: [HighUserPermission],
                    content: reason,
                    components: [],
                }),
            CommandInteraction: () =>
                (interaction as CommandInteraction).editReply({
                    embeds: [HighUserPermission],
                    content: reason,
                    components: [],
                }),
            Message: () =>
                (interaction as Message).edit({
                    embeds: [HighUserPermission],
                    content: reason,
                    components: [],
                }),
        };

        const ctorName = interaction.constructor.name; // "ButtonInteraction" | "CommandInteraction" | "Message"
        const handler = actionMap[ctorName];
        if (handler) await handler();
    } catch (err) {
        console.error("replaceEmbedWithHighPermission error:", err);
    }
}
