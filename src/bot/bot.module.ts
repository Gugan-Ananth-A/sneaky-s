import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { BotGateway } from './bot.gateway';
import { BondageModule } from 'src/bondage/bondage.module';

@Module({
  imports: [DiscordModule.forFeature(), BondageModule],
  providers: [BotGateway],
})
export class BotModule {}
