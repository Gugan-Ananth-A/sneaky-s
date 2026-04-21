import { Module } from '@nestjs/common';
import { DiscordModule } from 'node_modules/@discord-nestjs/core/dist';
import { ConfigModule } from 'node_modules/@nestjs/config';
import { DiscordConfigService } from './helper/discord-config.service';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DiscordModule.forRootAsync({
      useClass: DiscordConfigService,
    }),
    BotModule,
  ],
})
export class AppModule {}
