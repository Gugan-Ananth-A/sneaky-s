import { Injectable } from 'node_modules/@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { UserSettings } from './user-settings.entity';
import { Repository } from 'node_modules/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserSettings)
    private readonly userSettingsRepository: Repository<UserSettings>,
  ) {}

  async updateUserSettings(
    userId: string,
    settingsData: Partial<UserSettings>,
  ) {
    let settings = await this.userSettingsRepository.findOne({
      where: { userId },
    });

    const cleanData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(settingsData).filter(([_, v]) => v !== undefined),
    );

    if (!settings) {
      settings = this.userSettingsRepository.create({
        userId,
        ...cleanData,
      });
    } else {
      Object.assign(settings, cleanData);
    }
    return this.userSettingsRepository.save(settings);
  }

  async getUserSettings(userId: string): Promise<UserSettings | null> {
    return this.userSettingsRepository.findOne({
      where: { userId },
    });
  }
}
