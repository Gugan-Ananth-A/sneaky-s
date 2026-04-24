import { EmbedBuilder } from 'discord.js';
import { ActiveSession } from 'src/bondage/active-session.entity';
import { UserSettings } from 'src/user/user-settings.entity';

export function createSettingsEmbed(settings?: UserSettings): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x941900)
    .setTitle('Your Self-Bondage Settings')
    .setDescription('Your preferences have been saved!')
    .addFields(
      {
        name: 'Gag',
        value: (settings?.gag ?? false) ? '✅ Enabled' : '❌ Disabled',
        inline: true,
      },
      {
        name: 'Blindfold',
        value: (settings?.blindfold ?? false) ? '✅ Enabled' : '❌ Disabled',
        inline: true,
      },
      {
        name: 'Bondage Duration',
        value: `${settings?.defaultDuration ?? 30} minutes`,
        inline: true,
      },
      {
        name: 'Safeword',
        value: settings?.safeword ?? 'Red',
        inline: true,
      },
    )
    .setFooter({ text: 'Settings saved successfully!' })
    .setTimestamp();
}

export function createProfileEmbed(settings?: UserSettings): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x941900)
    .setTitle('Your Self-Bondage Profile!')
    .setDescription('Your preferences are as follows!')
    .addFields(
      {
        name: 'Gag',
        value: (settings?.gag ?? false) ? '✅ Enabled' : '❌ Disabled',
        inline: true,
      },
      {
        name: 'Blindfold',
        value: (settings?.blindfold ?? false) ? '✅ Enabled' : '❌ Disabled',
        inline: true,
      },
      {
        name: 'Bondage Duration',
        value: `${settings?.defaultDuration ?? 30} minutes`,
        inline: true,
      },
      {
        name: 'Safeword',
        value: settings?.safeword ?? 'Red',
        inline: true,
      },
    )
    .setFooter({ text: 'User bondage profile!' })
    .setTimestamp();
}

export function createSessionEmbed(session?: ActiveSession): EmbedBuilder {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 30);

  const endTime = new Date(
    session?.endTime?.getTime() ?? date.getTime(),
  ).toLocaleTimeString();

  const durationMinutes = Math.round((date.getTime() - Date.now()) / 60000);

  return new EmbedBuilder()
    .setColor(0x941900)
    .setTitle('Bondage Session Started!')
    .addFields(
      {
        name: 'Duration',
        value: `${durationMinutes} minutes`,
        inline: true,
      },
      { name: 'End Time', value: endTime, inline: true },
      {
        name: 'Restrictions',
        value: `${session?.gag ? 'Gag\n' : ''}${session?.blindfold ? 'Blindfold\n' : ''}`,
      },
      {
        name: 'Safeword',
        value: `Use \`/safeword\` if you need to escape`,
      },
    )
    .setFooter({ text: `Session ID: ${session?.id}` })
    .setTimestamp();
}
