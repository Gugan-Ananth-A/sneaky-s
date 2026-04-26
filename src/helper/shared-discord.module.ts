import { Global, Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { DiscordConfigService } from './discord-config.service';

@Global()
@Module({
  imports: [
    DiscordModule.forRootAsync({
      useClass: DiscordConfigService,
    }),
  ],
  exports: [DiscordModule],
})
export class SharedDiscordModule {}
