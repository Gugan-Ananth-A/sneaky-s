import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Client, Collection, Message, TextChannel } from 'discord.js';
import { InjectDiscordClient } from '@discord-nestjs/core';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  private readonly channelId = '1409564314934841394';
  private readonly delayMs = 1000;
  private readonly fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

  constructor(@InjectDiscordClient() private readonly client: Client) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanup(): Promise<void> {
    this.logger.log('Starting scheduled cleanup...');

    try {
      const channel = await this.fetchChannel();

      if (!channel) {
        return;
      }

      let lastMessageId: string | undefined;
      let totalDeleted = 0;

      while (true) {
        const messages = await this.fetchMessages(channel, lastMessageId);

        if (!messages.size) {
          break;
        }

        const deletableMessages = this.getDeletableMessages(messages);

        if (deletableMessages.size > 0) {
          const deleted = await channel.bulkDelete(deletableMessages, true);

          totalDeleted += deleted.size;

          this.logger.log(
            `Deleted ${deleted.size} messages (Total: ${totalDeleted})`,
          );
        }

        lastMessageId = messages.last()?.id;

        await this.delay(this.delayMs);
      }

      this.logger.log(
        `Cleanup completed successfully. Total deleted: ${totalDeleted}`,
      );
    } catch (error) {
      this.logger.error(
        'Cleanup failed',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private async fetchChannel(): Promise<TextChannel | null> {
    const channel = await this.client.channels.fetch(this.channelId);

    if (!channel || !(channel instanceof TextChannel)) {
      this.logger.error(
        `Channel ${this.channelId} not found or is not a text channel`,
      );

      return null;
    }

    return channel;
  }

  private async fetchMessages(
    channel: TextChannel,
    before?: string,
  ): Promise<Collection<string, Message<true>>> {
    return channel.messages.fetch({
      limit: 100,
      before,
    });
  }

  private getDeletableMessages(
    messages: Collection<string, Message<true>>,
  ): Collection<string, Message<true>> {
    return messages.filter((message) => {
      const hasWhiteCheckMarkReaction = message.reactions.cache.some(
        (reaction) => reaction.emoji.name === '✅',
      );

      const isOlderThan14Days =
        Date.now() - message.createdTimestamp > this.fourteenDaysMs;

      return !hasWhiteCheckMarkReaction && !isOlderThan14Days;
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
