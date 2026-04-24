import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { ActiveSession } from '../bondage/active-session.entity';
import { Module } from 'node_modules/@nestjs/common';
import { ReflectMetadataProvider } from 'node_modules/@discord-nestjs/core/dist';
import { UserSettings } from 'src/user/user-settings.entity';
import { BondageService } from './bondage.service';
import { BondageCommand } from './bondage.command';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings, ActiveSession])],
  providers: [BondageService, BondageCommand, ReflectMetadataProvider],
})
export class BondageModule {}
