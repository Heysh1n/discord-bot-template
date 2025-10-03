import {
  AutocompleteInteraction,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  Collection,
  CommandInteraction,
  GuildAuditLogs,
  Interaction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  SlashCommandBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { Job } from "node-schedule";

export type UserID = string;
export type CustomId = string;
export type InviteCode = string;
export type GuildID = string;

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => void;
  autoComplete?: (interaction: AutocompleteInteraction) => void;
}

export interface Button {
  customId: CustomId;
  execute: (
    interaction:
      | ButtonInteraction
      | ModalSubmitInteraction
      | StringSelectMenuInteraction
      | RoleSelectMenuInteraction
      | ChannelSelectMenuInteraction
      | Interaction
  ) => void;
}

export interface Event {
  name: string;
  once: boolean;
  execute: (...args: any) => void;
}

export interface Intervals {
  interval?: NodeJS.Timeout | any;
}

export type AuditCache = GuildAuditLogs<any> | undefined;

declare module "discord.js" {
  export interface Client {
    commands?: Collection<string, SlashCommand>;
    buttons?: Collection<CustomId, Button>;
    voiceUsers?: Collection<UserID, any>;
    subscribes?: Collection<string, Job>;
  }
}
