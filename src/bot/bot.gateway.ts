import { Injectable, Logger } from '@nestjs/common';
import { Once, InjectDiscordClient, On } from '@discord-nestjs/core';
import { Client, Message } from 'discord.js';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Once('ready')
  onReady() {
    this.logger.log(`Bot ${this.client.user?.tag} was started!`);
  }

  @On('messageCreate')
  async onMessage(message: Message): Promise<void> {
    if (message.author.bot) return;
    if (message.channel.id === '1409564314934841394') {
      if (
        !(
          (message.content?.includes('name') ?? false) ||
          (message.content?.includes('Name') ?? false)
        )
      ) {
        await message.reply(
          'You are missing to mention the name! Please, redo the entire template again to validate!',
        );
      } else if (
        !(
          (message.content?.includes('age') ?? false) ||
          (message.content?.includes('Age') ?? false)
        )
      ) {
        await message.reply('You are missing to mention the age!');
      } else if (ageValidator(message.content)) {
        await message.reply('Entered Age is not valid!');
      } else if (
        !(
          (message.content?.includes('gender') ?? false) ||
          (message.content?.includes('Gender') ?? false)
        )
      ) {
        await message.reply('You are missing to mention the gender!');
      } else if (
        !(
          (message.content?.includes('kinks') ?? false) ||
          (message.content?.includes('Kinks') ?? false) ||
          (message.content?.includes('kink') ?? false) ||
          (message.content?.includes('Kink') ?? false)
        )
      ) {
        await message.reply('You are missing to mention the kinks!');
      } else if (
        !(
          (message.content?.includes('limits') ?? false) ||
          (message.content?.includes('Limits') ?? false) ||
          (message.content?.includes('limit') ?? false) ||
          (message.content?.includes('Limit') ?? false)
        )
      ) {
        await message.reply('You are missing to mention the limits!');
      } else if (
        !(
          (message.content?.includes('secret code') ?? false) ||
          (message.content?.includes('secret Code') ?? false) ||
          (message.content?.includes('Secret Code') ?? false) ||
          (message.content?.includes('Secret code') ?? false) ||
          (message.content?.includes('secretcode') ?? false) ||
          (message.content?.includes('secretCode') ?? false) ||
          (message.content?.includes('SecretCode') ?? false) ||
          (message.content?.includes('Secretcode') ?? false)
        )
      ) {
        await message.reply('You are missing to mention the secret code!');
      } else if (secretCodeValidator(message.content)) {
        await message.reply(
          'Your secret code is not valid. Please check the rules again to find the secret code!\n-# *--There are 2 words hidden somewhere in the rules--*',
        );
      } else if (
        !(
          message.member?.roles.cache?.has('1409579304303726592') ||
          message.member?.roles.cache?.has('1409579306514124800') ||
          message.member?.roles.cache?.has('1409579307600445471')
        )
      ) {
        await message.reply(
          'Have you grabbed Roles? It seems you are missing roles...',
        );
      } else if (
        !(
          (message.content
            ?.toLocaleLowerCase()
            .includes('favourite bondage image') ??
            false) ||
          (message.content?.toLocaleLowerCase().includes('favourite bondage') ??
            false)
        )
      ) {
        await message.reply(
          'You are missing to add your favorite bondage image!',
        );
      } else {
        await message.react('✅');
        await message.member.roles.add('1409579308934234195');
      }
    }
  }
}
function ageValidator(content: string) {
  if (content.length === 0) return true;
  const ageMatch = content.match(/age\s*:\s*[^0-9]*(\d+)/i);
  if (ageMatch != null) {
    const age = ageMatch[1];
    if (parseInt(age) > 18 && parseInt(age) < 100) return false;
    return true;
  } else {
    return true;
  }
}

function secretCodeValidator(content: string) {
  if (content.length === 0) return true;
  const codeMatch = content.match(/secret\s*code\s*:\s*[^a-zA-Z]*([^\n\r]+)/i);
  console.log(codeMatch);
  if (codeMatch != null) {
    const code = codeMatch[1].trim().toLowerCase().split('*')[0];
    return !(code === 'ball gag' || code === 'ballgag');
  }
  return true;
}
