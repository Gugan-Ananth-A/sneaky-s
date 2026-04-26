import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { ActiveSession } from '../bondage/active-session.entity';
import { Module } from 'node_modules/@nestjs/common';
import { UserSettings } from 'src/user/user-settings.entity';
import { BondageService } from './bondage.service';
import { BondageCommand } from './bondage.command';
import { SafewordCommand } from './safeword.command';
import { ReleaseCronService } from './release.service';
import { SharedDiscordModule } from 'src/helper/shared-discord.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSettings, ActiveSession]),
    SharedDiscordModule,
  ],
  providers: [
    BondageService,
    ReleaseCronService,
    BondageCommand,
    SafewordCommand,
  ],
  exports: [BondageService],
})
export class BondageModule {}
