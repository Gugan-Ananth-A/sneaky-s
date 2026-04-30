import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveSession } from './active-session.entity';
import { Repository } from 'node_modules/typeorm';
import { UserSettings } from 'src/user/user-settings.entity';
import { scenarios } from './scenarios';
import { Client, GuildMember } from 'discord.js';
import { BondageScenario } from './bondage-scenarios';
import { InjectDiscordClient } from '@discord-nestjs/core';

type StartSessionOptions = {
  bondageDescription?: string;
  gag?: boolean;
  blindfold?: boolean;
};

@Injectable()
export class BondageService {
  constructor(
    @InjectRepository(ActiveSession)
    private readonly activeSessionRepository: Repository<ActiveSession>,
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  async startSession(
    userId: string,
    guildId: string,
    channelId: string,
    member: GuildMember,
    options: StartSessionOptions = {},
  ) {
    let settings = await this.userSettingsRepository.findOne({
      where: { userId },
    });

    if (!settings) {
      settings = this.userSettingsRepository.create({
        userId,
        defaultDuration: 30,
        safeword: 'red',
      });
      await this.userSettingsRepository.save(settings);
    }
    const scenarioDescription = this.getRandomScenario();
    const originalRoles = member.roles.cache.map((role) => role.id);
    const session = this.activeSessionRepository.create({
      userId,
      guildId,
      channelId,
      originalRoles,
      startTime: new Date(),
      endTime: new Date(
        Date.now() + (settings?.defaultDuration ?? 30) * 60 * 1000,
      ),
      bondageDescription:
        options.bondageDescription ?? `${scenarioDescription.bondage}`,
      gagDescription: `${scenarioDescription.gag}`,
      blindfoldDescription: `${scenarioDescription.blindfold}`,
      gag: options.gag ?? false,
      blindfold: options.blindfold ?? false,
      duration: settings.defaultDuration ?? 30,
      safeword: settings.safeword ?? 'red',
      status: 'active',
    });

    return this.activeSessionRepository.save(session);
  }

  async isCageChannel(channelId: string): Promise<ActiveSession | null> {
    const session = await this.activeSessionRepository.findOne({
      where: { channelId },
    });
    if (!session) return null;
    return session;
  }

  async handleSafeword(
    userId: string,
    channelId?: string,
    member?: GuildMember,
  ): Promise<void> {
    const session = await this.activeSessionRepository.findOne({
      where: { userId },
    });

    if (!session || !channelId) throw new Error('Session / Channel not found');
    await this.restoreRoles(member, session.originalRoles);
    await this.activeSessionRepository.delete({ userId });

    const channel = await this.client.channels.fetch(channelId);

    if (channel?.isTextBased()) {
      await channel.delete('Session ended');
    }
  }

  private async restoreRoles(
    member?: GuildMember,
    roleIds?: string[],
  ): Promise<void> {
    try {
      if (!roleIds) return;

      for (const role of roleIds) {
        if (role === member?.guild.id) continue;
        await member?.roles.add(role);
      }
      await member?.roles.remove('1497994703050903735');
    } catch (error) {
      console.error('Error restoring roles:', error);
      throw new Error('Failed to restore roles');
    }
  }

  async getActiveSession(userId: string): Promise<ActiveSession | null> {
    return await this.activeSessionRepository.findOne({
      where: { userId, status: 'active' },
    });
  }

  private getRandomScenario(): BondageScenario {
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }
}
