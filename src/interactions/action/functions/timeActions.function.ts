export const DURATION_MAP: Record<string, number> = {
    "1h": 1 * 60 * 60 * 1000,
    "1d": 1 * 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
    "90d": 90 * 24 * 60 * 60 * 1000,
};

export function parseDuration(input: string): number | undefined {
    const match = input.match(/^(\d+)([smhd])$/);
    if (!match) return undefined;
    const [, value, unit] = match;
    const num = parseInt(value);
    if (isNaN(num)) return undefined;
    switch (unit) {
        case "s": return num * 1000;
        case "m": return num * 60 * 1000;
        case "h": return num * 60 * 60 * 1000;
        case "d": return num * 24 * 60 * 60 * 1000;
        default: return undefined;
    }
}

export function formatPunishmentMessage(
    action: string,
    userTag: string,
    endDate: Date,
    durationMs: number,
    reason: string = "Не указана причина"
): string {
    const durationStr = durationMs >= 100 * 365 * 24 * 60 * 60 * 1000 ? "бессрочно" : endDate.toLocaleString();
    return `✅ ${action} для ${userTag} до ${durationStr}. Причина: ${reason}`;
}