import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveSession } from './active-session.entity';
import { Repository } from 'node_modules/typeorm';
import { UserSettings } from 'src/user/user-settings.entity';
// import { GuildMember } from 'discord.js';
import { scenarios } from './scenarios';

@Injectable()
export class BondageService {
  constructor(
    @InjectRepository(ActiveSession)
    private readonly activeSessionRepository: Repository<ActiveSession>,
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
  ) {}

  async startSession(
    userId: string,
    // guildId: string,
    // channelId: string,
    // member: GuildMember,
  ) {
    let settings = await this.userSettingsRepository.findOne({
      where: { userId },
    });

    if (!settings) {
      settings = this.userSettingsRepository.create({
        userId,
        gag: false,
        blindfold: false,
        defaultDuration: 30,
        safeword: 'Red',
      });
      await this.userSettingsRepository.save(settings);
    }
    // const scenarioDescription = this.getRandomScenario();
    // const originalRoles = member.roles.cache
    //   .filter((role: object) => role.id !== guildId)
    //   .map((role: object) => role.id);

    // console.log(originalRoles);

    // const session = this.activeSessionRepository.create({
    //   userId,
    //   guildId,
    //   channelId,
    //   originalRoles,
    //   startTime: new Date(),
    //   endTime: new Date(
    //     Date.now() + (settings?.defaultDuration ?? 30) * 60 * 1000,
    //   ),
    //   description: scenarioDescription,
    //   gag: settings.gag,
    //   blindfold: settings.blindfold,
    //   duration: settings.defaultDuration,
    //   safeword: settings.safeword,
    //   status: 'active',
    // });

    // return this.activeSessionRepository.save(session);
  }

  private getRandomScenario(): string {
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }
}
