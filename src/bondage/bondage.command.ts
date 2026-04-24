import { Command, Handler, InteractionEvent } from '@discord-nestjs/core/dist';
import { Injectable } from '@nestjs/common';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { BondageService } from './bondage.service';
// import { createSessionEmbed } from 'src/helper/embed-builder';

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
      member.roles.cache.forEach((role) => {
        console.log(role.name);
      });

      //   const existingSession = await this.bondageService.getActiveSession(
      //     interaction.user.id,
      //   );

      //   if (existingSession) {
      //     await interaction.followUp({
      //       content: 'You are already tied up! Try escaping first~',
      //       ephemeral: true,
      //     });
      //     return;
      //   }

      //   const session = await this.bondageService.startSession(
      //     interaction.user.id,
      //     interaction?.guildId ?? '',
      //     interaction.channelId,
      //     member,
      //   );

      //   const embed = createSessionEmbed(session);
      //   await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      await interaction.followUp({
        content: 'Error saving settings. Please try again!',
        ephemeral: true,
      });
    }
  }
}
