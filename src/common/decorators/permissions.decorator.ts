import { CommandPermissionType } from "../../config/permissions.config";
import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  GuildTextBasedChannel,
} from "discord.js";
import { defaultColours } from "@constants";

export function UseGuard(permissions: CommandPermissionType) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    try {
      const originalMethod = descriptor.value;
      descriptor.value = async function (interaction: CommandInteraction) {
        try {
          const { channels, roles, users, categories } = permissions;
          const embed = new EmbedBuilder()
            .setTitle(`Ошибка применения команды`)
            .setTimestamp(new Date())
            .setThumbnail(interaction.user.displayAvatarURL({ size: 4096 }))
            .setColor(defaultColours.baseEmbed);

          if (!users.includes("*")) {
            if (!users.includes(interaction.user.id)) {
              return await interaction.reply({
                embeds: [embed.setDescription(`У вас недостаточно прав!`)],
                ephemeral: true,
              });
            }
          }

          if (!roles.includes("*")) {
            const member = interaction.member as GuildMember;
            if (!member.roles.cache.some((role) => roles.includes(role.id))) {
              return await interaction.reply({
                embeds: [
                  embed.setDescription(
                    `Вы не можете использовать команду из-за недостатка прав`
                  ),
                ],
                ephemeral: true,
              });
            }
          }

          if (!categories.includes("*")) {
            const parentId = (interaction.channel as GuildTextBasedChannel)
              .parentId as string;
            if (!categories.includes(parentId)) {
              return await interaction.reply({
                embeds: [
                  embed.setDescription(
                    `Вы используете команду не в той категории`
                  ),
                ],
                ephemeral: true,
              });
            }
          }

          if (!channels.includes("*")) {
            if (!channels.includes(interaction.channelId as string)) {
              return await interaction.reply({
                embeds: [
                  embed.setDescription(
                    `Вы используете команду не в том канале!`
                  ),
                ],
                ephemeral: true,
              });
            }
          }
          return await originalMethod.call(this, interaction);
        } catch {}
      };
      return descriptor;
    } catch {}
  };
}
