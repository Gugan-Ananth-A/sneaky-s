import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { UserSettings } from './user-settings.entity';
import { ActiveSession } from '../bondage/active-session.entity';
import { Module } from 'node_modules/@nestjs/common';
import { UserService } from './user.service';
import { UserSettingsCommand } from './user.command';
import { ReflectMetadataProvider } from 'node_modules/@discord-nestjs/core/dist';
import { UserProfileCommand } from './profile.command';
import { CleanupService } from './cleanup.service';
import { RoleSeparatorService } from './role_separator.service';
import { SharedDiscordModule } from 'src/helper/shared-discord.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSettings, ActiveSession]),
    SharedDiscordModule,
  ],
  providers: [
    UserService,
    UserSettingsCommand,
    UserProfileCommand,
    CleanupService,
    RoleSeparatorService,
    ReflectMetadataProvider,
  ],
})
export class UsersModule {}
