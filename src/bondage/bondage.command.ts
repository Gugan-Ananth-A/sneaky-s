import { Command, Handler, InteractionEvent } from '@discord-nestjs/core/dist';
import { Injectable } from '@nestjs/common';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { BondageService } from './bondage.service';
import { createSessionEmbed } from 'src/helper/embed-builder';

@Command({
  name: 'bind-me',
  description: 'Start your bondage~',
})
@Injectable()
export class BondageCommand {
  constructor(private bondageService: BondageService) {}

  @Handler()
  async onBondage(
    @InteractionEvent() interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    await interaction.deferReply();
    try {
      const member = interaction.member as GuildMember;

      const existingSession = await this.bondageService.getActiveSession(
        interaction.user.id,
      );

      if (existingSession) {
        await interaction.followUp({
          content: 'You are already tied up! Try escaping first~',
          ephemeral: true,
        });
        return;
      }

      const channel = await interaction.guild?.channels.create({
        name: `cage-${interaction.user.displayName}`,
        nsfw: true,
        type: 0,
        parent: '1497956351480041632',
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ['ViewChannel'],
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'SendMessages', 'UseApplicationCommands'],
          },
        ],
      });

      if (!channel) {
        await interaction.followUp({
          content: 'Error creating a new channel...',
          ephemeral: true,
        });
        return;
      }

      const session = await this.bondageService.startSession(
        interaction.user.id,
        interaction?.guildId ?? '',
        channel?.id,
        member,
      );

      const embed = createSessionEmbed(session);
      await interaction.followUp({ embeds: [embed] });

      await member.roles.set([]);
      await member.roles.add('1497994703050903735');

      if (channel && channel.isTextBased()) {
        if ((session.blindfold ?? false) && (session.gag ?? false)) {
          await channel.send(
            `Hello <@${interaction.user.id}>~\n\n${session.bondageDescription}`,
          );
          await channel.send(
            `** **\n${session.gagDescription}\n\n${session.blindfoldDescription}`,
          );
        } else if (session.blindfold ?? false) {
          await channel.send(
            `Hello <@${interaction.user.id}>~\n\n${session.bondageDescription}\n\n${session.blindfoldDescription}`,
          );
        } else if (session.gag ?? false) {
          await channel.send(
            `Hello <@${interaction.user.id}>~\n\n${session.bondageDescription}\n\n${session.gagDescription}`,
          );
        } else {
          await channel.send(
            `Hello <@${interaction.user.id}>~\n\n${session.bondageDescription}`,
          );
        }
      }
    } catch (error) {
      console.log(error);
      await interaction.followUp({
        content: 'Error saving settings. Please try again!',
        ephemeral: true,
      });
    }
  }
}
