import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { UserSettings } from './user-settings.entity';
import { ActiveSession } from '../bondage/active-session.entity';
import { Module } from 'node_modules/@nestjs/common';
import { UserService } from './user.service';
import { UserSettingsCommand } from './user.command';
import { ReflectMetadataProvider } from 'node_modules/@discord-nestjs/core/dist';
import { UserProfileCommand } from './profile.command';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings, ActiveSession])],
  providers: [
    UserService,
    UserSettingsCommand,
    UserProfileCommand,
    ReflectMetadataProvider,
  ],
})
export class UsersModule {}
