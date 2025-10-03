import {
  ChatInputCommandInteraction,
  ButtonInteraction,
  GuildMember,
  ComponentType
} from "discord.js";

import {
  ActionMainRow,
  ActionUsefulRow,
  ActionHeavyRow,
  ActionWarnsRow,
} from "@config/components/global.components";
import {
  role_Owner,
  roles_MGRs,
  role_Curator,
  role_Moderator,
} from "@config/config";
import { CreateUserProfileEmbed } from "./functions/embedResponse.function";
import { ActionCache } from "@migrations/localCache.service";
import { ActionButtonHandler } from "./functions/buttonHandler.function";

export class ActionService {
  interaction: ChatInputCommandInteraction | ButtonInteraction;
  target: GuildMember;

  constructor(interaction: ChatInputCommandInteraction | ButtonInteraction, target: GuildMember) {
    this.interaction = interaction;
    this.target = target;
  }

  async execute(options?: { editOnly?: boolean }) {

    const executor = this.interaction.member as GuildMember;
    const UserActionEmbed = await CreateUserProfileEmbed(this.interaction, this.target);
    const executorRoleIds = executor.roles.cache.map((r) => r.id);
    const hasRole = (roles: string[] | string): boolean =>
      Array.isArray(roles)
        ? roles.some((r) => executorRoleIds.includes(r))
        : executorRoleIds.includes(roles);

    const roleButtonsMap: { check: string[] | string; rows: any[] }[] = [
      { check: role_Owner, rows: [ActionMainRow, ActionUsefulRow, ActionHeavyRow, ActionWarnsRow] },
      { check: roles_MGRs, rows: [ActionMainRow, ActionUsefulRow, ActionHeavyRow, ActionWarnsRow] },
      { check: role_Curator, rows: [ActionMainRow, ActionUsefulRow, ActionWarnsRow] },
      { check: role_Moderator, rows: [ActionMainRow, ActionUsefulRow] },
    ];

    let rowsToShow: any[] = [];
    for (const { check, rows } of roleButtonsMap) {
      if (hasRole(check)) {
        rowsToShow = rows;
        break;
      }
    }

    if (rowsToShow.length === 0) {
      return this.interaction.reply({ content: "❌ У вас нет доступа к панели действий.", ephemeral: true });
    }

    // ⚡ Если editOnly=true — редактируем уже отправленное сообщение
    if (options?.editOnly) {
      await this.interaction.editReply({
        embeds: [UserActionEmbed],
        components: rowsToShow,
      }).catch(() => null);
      return;
    }

    // Если slash-команда
    if (this.interaction.isChatInputCommand()) {
      await this.interaction.deferReply().catch(() => null);
      const reply = await this.interaction.followUp({
        embeds: [UserActionEmbed],
        components: rowsToShow,
      });
      if (!reply || !("createMessageComponentCollector" in reply)) return;

      ActionCache.set(reply.id, this.target.id);

      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 600_000, // 10 минут
      });

      collector.on("collect", async (btnInteraction) => {
        await ActionButtonHandler.handle(btnInteraction);
      });

      collector.on("end", () => console.log("[⏰] Коллектор кнопок завершил работу"));

      return reply;
    } else {
      await this.interaction.update({
        embeds: [UserActionEmbed],
        components: rowsToShow,
      }).catch(() => null);
    }
  }
}

