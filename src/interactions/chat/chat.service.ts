import {
  CommandInteraction,
  EmbedBuilder,
  version as discordVersion,
  Message,
} from 'discord.js';

const userActivityMap: Map<string, { lastActivity: string }> = new Map();

export class ChatService {
  interaction: CommandInteraction;
  message: Message | null = null;

  constructor(interaction: CommandInteraction) {
    this.interaction = interaction;
  }

  async execute() {
    await this.interaction.deferReply();

    const userId = this.interaction.user.id;

    let userActivity = userActivityMap.get(userId);
    if (!userActivity) {
      userActivity = { lastActivity: 'нету' };
      userActivityMap.set(userId, userActivity);
    }

    const guild = this.interaction.guild;
    let totalMembers = 0;
    let humanMembers = 0;
    let botMembers = 0;

    if (guild) {
      await guild.members.fetch();

      guild.members.cache.forEach((member) => {
        totalMembers++;
        if (member.user.bot) {
          botMembers++;
        } else {
          humanMembers++;
        }
      });
    }

    const embed = this.createEmbed(guild, userId, totalMembers, humanMembers, botMembers);

    this.message = await this.interaction.followUp({
      content: `> **||${this.interaction.user}||**`,
      embeds: [embed],
      fetchReply: true,
    }) as Message;
  }

  createEmbed(guild: any, userId: string, totalMembers: number, humanMembers: number, botMembers: number) {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    return new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Технический мониторинг')
      .setDescription('Мониторинг технической информации')
      .addFields(
        {
          name: 'Версия Discord.js',
          value: `> Version: __*${discordVersion}*__`,
          inline: true,
        },
        {
          name: 'Версия Node.js',
          value: `> Version: __*${process.version}*__`,
          inline: true,
        },
        {
          name: 'Имя сервера',
          value: `\`\`\`${guild?.name}\`\`\`` || '> __Available only in server__',
          inline: false,
        },
        {
          name: 'ID Сервера',
          value: `\`\`\`${guild?.id}\`\`\`` || '> __Available only in server__',
          inline: true,
        },
        {
          name: 'ID Пользователя',
          value: `\`\`\`${userId}\`\`\``,
          inline: false,
        },
        {
          name: 'Упоминание пользователя',
          value: `> **${this.interaction.user}**`,
          inline: true,
        },
        {
          name: ' ',
          value: ` `,
          inline: false,
        },
        {
          name: 'Общее кол-во пользователей',
          value: `> **${totalMembers.toString()}**`,
          inline: true,
        },
        {
          name: 'Люди',
          value: `> **${humanMembers.toString()}**`,
          inline: true,
        },
        {
          name: 'Боты',
          value: `> *${botMembers.toString()}*`,
          inline: true,
        },
        {
          name: 'Последнее использование (`/chat`)',
          value: `> __*<t:${currentTimestamp}:R>*__`, 
          inline: true,
        }
      )
      .setTimestamp();
  }
}
