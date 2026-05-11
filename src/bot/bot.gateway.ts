import { Injectable, Logger } from '@nestjs/common';
import { Once, InjectDiscordClient, On } from '@discord-nestjs/core';
import { Client, GuildMember, Message, TextChannel } from 'discord.js';
import { BondageService } from 'src/bondage/bondage.service';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private bondageService: BondageService,
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
          'You are missing to mention the name!\n*-# -- Please copy & post the entire template again in the same format to verify --*',
        );
      } else if (
        !(
          (message.content?.includes('age') ?? false) ||
          (message.content?.includes('Age') ?? false)
        )
      ) {
        await message.reply(
          'You are missing to mention the age!\n*-# -- Please copy & post the entire template again in the same format to verify  --*',
        );
      } else if (ageValidator(message.content)) {
        await message.reply(
          'Entered Age is not valid!\n*-# -- Please copy & post the entire template again in the same format to verify  --*',
        );
      } else if (
        !(
          (message.content?.includes('gender') ?? false) ||
          (message.content?.includes('Gender') ?? false)
        )
      ) {
        await message.reply(
          'You are missing to mention the gender!\n*-# -- Please copy & post the entire template again in the same format to verify  --*',
        );
      } else if (
        !(
          (message.content?.includes('kinks') ?? false) ||
          (message.content?.includes('Kinks') ?? false) ||
          (message.content?.includes('kink') ?? false) ||
          (message.content?.includes('Kink') ?? false)
        )
      ) {
        await message.reply(
          'You are missing to mention the kinks!\n*-# -- Please copy & post the entire template again in the same format to verify  --*',
        );
      } else if (
        !(
          (message.content?.includes('limits') ?? false) ||
          (message.content?.includes('Limits') ?? false) ||
          (message.content?.includes('limit') ?? false) ||
          (message.content?.includes('Limit') ?? false)
        )
      ) {
        await message.reply(
          'You are missing to mention the limits!\n*-# -- Please copy & post the entire template again in the same format to verify  --*',
        );
      } else if (message.author.avatar === null) {
        await message.reply(
          "It seems you don't have a discord profile picture!\n*-# -- Please add a profile picture, and then, copy & post the entire template again in the same format to verify  --*",
        );
      } else if (
        !(
          (message.content?.includes('secret code') ?? false) ||
          (message.content?.includes('secret Code') ?? false) ||
          (message.content?.includes('Secret Code') ?? false) ||
          (message.content?.includes('Secret code') ?? false) ||
          (message.content?.includes('secretcode') ?? false) ||
          (message.content?.includes('secretCode') ?? false) ||
          (message.content?.includes('SecretCode') ?? false) ||
          (message.content?.includes('Secretcode') ?? false) ||
          (message.content?.toLocaleLowerCase().includes('secret') ?? false) ||
          (message.content?.toLocaleLowerCase().includes('code') ?? false)
        )
      ) {
        await message.reply(
          'You are missing to mention the secret code!\n*-# -- Please copy & post the entire template again in the same format to verify  --*',
        );
      } else if (secretCodeValidator(message.content)) {
        await message.reply(
          'Your secret code is not valid. Please check the rules again to find the secret code!\n-# *-- There are 2 words hidden somewhere in the rules --*\n*-# -- Please copy & post the entire template again in the same format to verify  --*',
        );
      } else if (
        !(
          message.member?.roles.cache?.has('1409579304303726592') ||
          message.member?.roles.cache?.has('1409579306514124800') ||
          message.member?.roles.cache?.has('1409579307600445471')
        )
      ) {
        await message.reply(
          'Have you grabbed Roles? It seems you are missing roles... \n*-# -- Grab the roles you missed to grab, and please copy & post the entire template again in the same format to verify  --*',
        );
      } else if (bondageImageValidator(message)) {
        await message.reply(
          'You are missing to add your favourite bondage image!\n*-# -- Please copy & post the entire template again in the same format to verify  --*',
        );
      } else if (
        !(
          message.content.toLocaleLowerCase().includes('important') ||
          message.content.toLocaleLowerCase().includes('role') ||
          message.content.toLocaleLowerCase().includes('word')
        )
      ) {
        await message.reply(
          'You are missing to add the important rule!\n*-# -- Please copy & post the entire template again in the same format to verify  --*',
        );
      } else if (importantRuleValidator(message)) {
        await message.reply(
          'The important rule might be wrong or missing important details!\n*-# -- Please use the exact terms. Copy & post the entire template again in the same format to verify  --*',
        );
      } else {
        await message.react('✅');
        await message.member?.roles.add('1409579308934234195');
      }
    } else {
      const cageChannel = await this.bondageService.isCageChannel(
        message.channel.id,
      );
      if (message.content.toLocaleLowerCase() === cageChannel?.safeword) {
        await this.bondageService.handleSafeword(
          message.author.id,
          cageChannel.channelId,
          message.member ?? undefined,
        );
      }
      if (
        ((cageChannel?.gag ?? false) || (cageChannel?.blindfold ?? false)) &&
        message.channel instanceof TextChannel
      ) {
        await message.delete().catch(() => null);

        if (
          (cageChannel?.gag ?? false) &&
          cageChannel?.userId === message.author.id
        ) {
          const webhook = await message.channel.createWebhook({
            name: message.member?.displayName || message.author.username,
            avatar: message.author.displayAvatarURL(),
          });
          const garbledText = garbleText(message);
          await webhook.send({
            content: garbledText,
          });

          await webhook.delete();
          return;
        } else if (
          (cageChannel?.blindfold ?? false) &&
          cageChannel?.userId !== message.author.id
        ) {
          const webhook = await message.channel.createWebhook({
            name: getPersonaName(message.member as GuildMember),
            avatar: message.author.displayAvatarURL(),
          });

          await webhook.send({
            content: message.content,
          });

          await webhook.delete();
          return;
        }
      }
    }
  }
}

function getPersonaName(member: GuildMember): string {
  const roles = member.roles.cache.map((r) => r.name.toLowerCase());

  const powerRoles = ['dominant', 'submissive', 'switch'];
  const identityRoles = ['male', 'female', 'other'];

  const power = powerRoles.find((r) => roles.includes(r));
  const identity = identityRoles.find((r) => roles.includes(r));

  const finalPower = power ?? 'mysterious';
  const finalIdentity = identity ?? 'being';

  return `A ${finalPower} ${finalIdentity}`;
}

function garbleText(message: Message) {
  const text = message.content;

  const vowels = 'aeiou';
  const muffledSounds = ['m', 'n', 'ng', 'mm', 'nn'];

  return `${text
    .split('')
    .map((char) => {
      const lower = char.toLowerCase();
      if (!/[a-z]/i.test(char)) return char;
      if (vowels.includes(lower)) {
        return muffledSounds[Math.floor(Math.random() * muffledSounds.length)];
      }
      return Math.random() > 0.9 ? 'm' : char;
    })
    .join('')}\n\n||*${message.content}*||`;
}

function ageValidator(content: string) {
  if (content.length === 0) return true;
  const ageMatch = content.match(/age\s*:?\s*[^0-9]*(\d+)/i);
  if (ageMatch != null) {
    const age = ageMatch[1];
    if (parseInt(age) >= 18 && parseInt(age) < 100) return false;
    return true;
  } else {
    return true;
  }
}

function secretCodeValidator(content: string) {
  if (content.length === 0) return true;
  const codeMatch = content.match(
    /\b(?:secret\s*)?(?:code|word|words)\s*:?\s*[^a-zA-Z]*([^\n\r]+)/i,
  );
  if (codeMatch != null) {
    const code = codeMatch[1].trim().toLowerCase().split('*')[0];
    return !(
      code.includes('ball gag') ||
      code.includes('ballgag') ||
      (code.includes('ball') && code.includes('gag'))
    );
  }
  return true;
}

function bondageImageValidator(message: Message<boolean>) {
  const content = message.content?.toLowerCase() || '';
  const hasKeyword =
    content.includes('favourite') ||
    content.includes('favorite') ||
    content.includes('image') ||
    content.includes('fav');
  const hasLink = /(https?:\/\/[^\s]+)/g.test(content);
  const hasAttachments = message.attachments.size > 0;
  return !(hasKeyword || hasLink || hasAttachments);
}

function importantRuleValidator(message: Message<boolean>) {
  const content = message.content?.toLowerCase() || '';
  return !(
    content.includes('dm') &&
    content.includes('server') &&
    content.includes('role') &&
    content.includes('ask')
  );
}
