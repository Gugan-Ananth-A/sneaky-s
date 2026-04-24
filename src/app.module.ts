import { Module } from '@nestjs/common';
import { DiscordModule } from 'node_modules/@discord-nestjs/core/dist';
import { ConfigModule } from 'node_modules/@nestjs/config';
import { DiscordConfigService } from './helper/discord-config.service';
import { BotModule } from './bot/bot.module';
import { dataSourceOptions } from './db/config/datasource.config';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { BondageModule } from './bondage/bondage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DiscordModule.forRootAsync({
      useClass: DiscordConfigService,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    BotModule,
    UsersModule,
    BondageModule,
  ],
})
export class AppModule {}
