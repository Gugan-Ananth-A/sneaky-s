import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Client, Collection, Message, TextChannel } from 'discord.js';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly client: Client) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanup() {
    try {
      const channelId = '1409564314934841394';

      const channel = await this.client.channels.fetch(channelId);

      if (!channel || !(channel instanceof TextChannel)) {
        this.logger.error('Channel not found or not a text channel');
        return;
      }

      let lastMessageId: string | undefined;
      let totalDeleted = 0;

      while (true) {
        const messages: Collection<
          string,
          Message<true>
        > = await channel.messages.fetch({
          limit: 100,
          before: lastMessageId,
        });

        if (messages.size === 0) {
          break;
        }

        const deletableMessages = messages.filter((message) => {
          const hasWhiteCheckMarkReaction = message.reactions.cache.some(
            (reaction) => reaction.emoji.name === '✅',
          );

          const isOlderThan14Days =
            Date.now() - message.createdTimestamp > 14 * 24 * 60 * 60 * 1000;

          return !hasWhiteCheckMarkReaction && !isOlderThan14Days;
        });

        if (deletableMessages.size > 0) {
          const deleted = await channel.bulkDelete(deletableMessages, true);

          totalDeleted += deleted.size;
        }

        lastMessageId = messages.last()?.id;

        // Prevent rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      this.logger.log(`Deleted ${totalDeleted} messages`);
    } catch (error) {
      this.logger.error('Cleanup failed', error);
    }
  }
}
