import { ButtonInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { LocalDB } from "@migrations/localdb.service";
import { ActionDefaultRow } from "@components/global.components";

interface RecordEntry {
    category: string;
    reason?: string;
    action?: string;
    moderator: string;
    dateStart?: string;
    dateEnd?: string;
}

// ===== Функция для форматирования полей истории =====
function formatUserHistoryFields(dbUser: any): { name: string; value: string; inline: boolean }[] {
    if (!dbUser) return [];
    const allRecords: RecordEntry[] = [
        ...(dbUser.warns ?? []).map(w => ({ ...w, category: "⚠️ Предупреждения" })),
        ...(dbUser.staffWarns ?? []).map(sw => ({ ...sw, category: "📌 Выговоры" })),
        ...(dbUser.remarks ?? []).map(r => ({ ...r, category: "💬 Замечания" })),
        ...(dbUser.staffLockHistory ?? []).map(l => ({ ...l, category: "🚫 ЧС" })),
        ...(dbUser.banHistory ?? []).map(b => ({ ...b, category: "⛔ Баны" })),
        ...(dbUser.muteHistory ?? []).map(m => ({ ...m, category: "🔇 Муты" })),
        ...(dbUser.timeoutHistory ?? []).map(t => ({ ...t, category: "⏱ Отстранения" })),
    ];

    if (allRecords.length === 0) return [];

    const grouped: Record<string, RecordEntry[]> = {};
    allRecords.forEach(record => {
        if (!grouped[record.category]) grouped[record.category] = [];
        grouped[record.category].push(record);
    });

    const fields: { name: string; value: string; inline: boolean }[] = [];

    for (const category of Object.keys(grouped)) {
        const value = grouped[category]
            .map((rec, i) => {
                const recordText = rec.reason ?? rec.action;
                const startTimestamp = rec.dateStart ? `<t:${Math.floor(new Date(rec.dateStart).getTime() / 1000)}:F>` : "";
                const endTimestamp = rec.dateEnd ? `<t:${Math.floor(new Date(rec.dateEnd).getTime() / 1000)}:F>` : "";
                const durationText =
                    rec.dateStart && rec.dateEnd
                        ? Math.round(
                              (new Date(rec.dateEnd).getTime() - new Date(rec.dateStart).getTime()) /
                                  (24 * 60 * 60 * 1000)
                          ) + " дн."
                        : "";
                return `\`${i + 1}\`. **${recordText}** — ${rec.moderator} ${startTimestamp}${
                    endTimestamp ? ` → ${endTimestamp} (${durationText})` : ""
                }`;
            })
            .join("\n");
        fields.push({ name: category, value: value || "—", inline: false });
    }

    return fields;
}

export async function handleHistoryButton(interaction: ButtonInteraction, targetId: string) {
    if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral }).catch(() => null);
    }

    const target = interaction.guild?.members.cache.get(targetId)
        ?? await interaction.guild?.members.fetch(targetId).catch(() => null);

    if (!target) {
        return interaction.editReply({
            content: "❌ Не удалось получить пользователя.",
            components: [],
        }).catch(() => null);
    }

    const dbUser = LocalDB.getUser(target.id);

    const embed = new EmbedBuilder()
        .setTitle(`📜 История наказаний: ${target.user.tag}`)
        .setColor("Orange")
        .setFooter({ text: `ID: ${target.id}` })
        .setTimestamp();

    const fields = formatUserHistoryFields(dbUser);
    if (fields.length === 0) {
        embed.setDescription("✅ У пользователя нет записей в истории.");
    } else {
        embed.addFields(fields);
    }

    return interaction.editReply({
        embeds: [embed],
        components: [],

    }).catch(() => null);
}
