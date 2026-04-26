import { Module } from '@nestjs/common';
import { ConfigModule } from 'node_modules/@nestjs/config';
import { BotModule } from './bot/bot.module';
import { dataSourceOptions } from './db/config/datasource.config';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { BondageModule } from './bondage/bondage.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedDiscordModule } from './helper/shared-discord.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    SharedDiscordModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    BotModule,
    UsersModule,
    BondageModule,
  ],
})
export class AppModule {}
