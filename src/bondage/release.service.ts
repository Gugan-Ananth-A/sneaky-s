import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveSession } from './active-session.entity';
import { Client } from 'discord.js';
import { InjectDiscordClient } from '@discord-nestjs/core';

@Injectable()
export class ReleaseCronService {
  constructor(
    @InjectRepository(ActiveSession)
    private readonly activeSessionRepository: Repository<ActiveSession>,
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredSessions() {
    const now = new Date();

    const expiredSessions = await this.activeSessionRepository.find({
      where: {
        status: 'active',
      },
    });

    for (const session of expiredSessions) {
      if ((session.endTime ?? now) <= now) {
        try {
          const guild = await this.client.guilds.fetch(session?.guildId ?? '');
          const member = await guild.members.fetch(session?.userId ?? '');

          if (!session?.originalRoles || !session?.channelId) return;

          for (const role of session?.originalRoles ?? []) {
            if (role === member.guild.id) continue;
            await member.roles.add(role);
          }
          await member.roles.remove('1497994703050903735');
          if (session.userId != null) {
            await this.activeSessionRepository.delete({
              userId: session.userId,
            });
          }

          const channel = await this.client.channels.fetch(session.channelId);

          if (channel?.isTextBased()) {
            await channel.delete('Session ended');
          }
        } catch (err) {
          console.error(`Failed to release ${session.userId}`, err);
        }
      }
    }
  }
}
