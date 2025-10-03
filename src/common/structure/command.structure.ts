import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  AutocompleteInteraction,
} from "discord.js";

export abstract class SlashCommandStructure {
  readonly data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

  constructor(data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder) {
    this.data = data;
  }

  abstract execute(interaction: ChatInputCommandInteraction): Promise<any>;

  abstract autoComplete?(interaction: AutocompleteInteraction): Promise<any>;
}
