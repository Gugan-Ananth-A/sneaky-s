import { Command, Handler, InteractionEvent } from '@discord-nestjs/core/dist';
import { Injectable } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  GuildTextBasedChannel,
  GuildMember,
  Message,
} from 'discord.js';
import { createCustomSessionEmbed } from 'src/helper/embed-builder';
import { BondageService } from './bondage.service';

const QUESTION_TIMEOUT_MS = 20_000;

type BindQuestion = {
  target: string;
  prompt: string;
  options: readonly string[];
};

const STANDARD_OPTIONS = [
  'Rope',
  'Transparent Tape',
  'Electric Tape',
  'Leather Belt',
  'Ziptie',
  'Scarves',
  'Metal Chain',
  'Skip',
];

const BIND_QUESTIONS: readonly BindQuestion[] = [
  {
    target: 'Wrists',
    prompt: 'How would you like your wrists tied?',
    options: [
      'Hand-cuff',
      'Rope',
      'Transparent Tape',
      'Electric Tape',
      'Leather Belt',
      'Ziptie',
      'Scarves',
      'Metal Chain',
    ],
  },
  {
    target: 'Forearms',
    prompt: 'How would you like your forearms tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Elbows',
    prompt: 'How would you like your elbows tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Upper arms',
    prompt: 'How would you like your upper arms tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Chest',
    prompt: 'How would you like your chest tied?',
    options: [
      'Rope Harness',
      'Transparent Tape Harness',
      'Electric Tape Harness',
      'Leather Harness',
      'Scarves Harness',
      'Chain Harness',
      'Skip',
    ],
  },
  {
    target: 'Waist',
    prompt: 'How would you like your waist tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Crotch',
    prompt: 'How would you like your crotch tied?',
    options: [
      'Crotch Rope',
      'Crotch Leather Belt',
      'Crotch Scarf',
      'Crotch Metal Chain',
      'Skip',
    ],
  },
  {
    target: 'Upper thighs',
    prompt: 'How would you like your upper thighs tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Lower thighs',
    prompt: 'How would you like your lower thighs tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Upper knees',
    prompt: 'How would you like your upper knees tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Lower knees',
    prompt: 'How would you like your lower knees tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Calves',
    prompt: 'How would you like your calves tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Ankles',
    prompt: 'How would you like your ankles tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Soles',
    prompt: 'Do you like your soles tied?',
    options: STANDARD_OPTIONS,
  },
  {
    target: 'Blindfold',
    prompt: 'What Blindfold do you choose?',
    options: [
      'Leather Blindfold',
      'Cloth Blindfold',
      'Scarves Blindfold',
      'Transparent Tape Blindfold',
      'Electric Tape Blindfold',
      'Sleep Mask',
      'Satin Blindfold',
      'Skip',
    ],
  },
  {
    target: 'Mouth Stuffing',
    prompt: 'How would you like your mouth stuffed?',
    options: [
      'Sponge Ball',
      'Dirty Rag',
      'Clothes',
      'Socks',
      'Dirty Socks',
      'Pantyhose',
      'Scarves',
      'Panties',
      'Skip',
    ],
  },
  {
    target: 'Mouth Gag',
    prompt: 'What gag do you choose?',
    options: [
      'Ball Gag',
      'Harness Ball Gag',
      'Leather Panel Gag',
      'Electric Tape',
      'Transparent Tape',
      'Scarves Cleave Gag',
      'Scarves OTM Gag',
      'Scarves OTN Gag',
      'Cloth Cleave Gag',
      'Cloth OTM Gag',
      'Cloth OTN Gag',
      'Rope Cleave Gag',
      'Ring Gag',
      'Harness Ring Gag',
      'Skip',
    ],
  },
  {
    target: 'Additional Gag Layer',
    prompt: 'Would you like an additional Gag Layer?',
    options: [
      'Electric Tape',
      'Transparent Tape',
      'Scarves OTM Gag',
      'Scarves OTN Gag',
      'Cloth OTM Gag',
      'Cloth OTN Gag',
      'Skip',
    ],
  },
] as const;

const READY_QUESTION: BindQuestion = {
  target: 'Ready',
  prompt: 'Are you ready?',
  options: ['Yes', 'No'],
};

@Command({
  name: 'bind',
  description: 'Customize how you like to get tied up~',
})
@Injectable()
export class BindCommand {
  private readonly pendingSetups = new Set<string>();

  constructor(private bondageService: BondageService) {}

  @Handler()
  async onBind(
    @InteractionEvent() interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    await interaction.deferReply();

    if (this.pendingSetups.has(interaction.user.id)) {
      await interaction.followUp({
        content: 'You are already tied up! Try escaping first~',
        ephemeral: true,
      });
      return;
    }

    this.pendingSetups.add(interaction.user.id);

    try {
      const member = interaction.member as GuildMember;
      const sourceChannel = interaction.channel;

      if (!interaction.guild || !sourceChannel?.isTextBased()) {
        await interaction.followUp({
          content:
            'This command can only be used inside a server text channel!',
          ephemeral: true,
        });
        return;
      }

      const existingSession = await this.bondageService.getActiveSession(
        interaction.user.id,
      );

      if (existingSession) {
        await interaction.followUp({
          content: 'You are already tied up! Try escaping first~',
          ephemeral: true,
        });
        return;
      }

      const answers: { question: BindQuestion; answer: string }[] = [];

      for (const question of BIND_QUESTIONS.values()) {
        const answer = await this.askQuestion(
          interaction,
          sourceChannel as GuildTextBasedChannel,
          question,
        );

        if (!answer) return;
        answers.push({ question, answer });
      }

      const readyAnswer = await this.askQuestion(
        interaction,
        sourceChannel as GuildTextBasedChannel,
        READY_QUESTION,
      );

      if (!readyAnswer) return;

      if (this.normalizeOption(readyAnswer) === 'no') {
        await interaction.followUp('Binding setup cancelled!');
        return;
      }

      await this.createCageSession(interaction, member, answers);
    } catch (error) {
      console.log(error);
      await interaction.followUp({
        content: 'Error saving settings. Please try again!',
        ephemeral: true,
      });
    } finally {
      this.pendingSetups.delete(interaction.user.id);
    }
  }

  private async askQuestion(
    interaction: ChatInputCommandInteraction,
    channel: GuildTextBasedChannel,
    question: BindQuestion,
  ): Promise<string | null> {
    await interaction.followUp(
      `${'```'}${this.createQuestionText(question)}${'```'}`,
    );

    const collected = await channel.awaitMessages({
      filter: (message: Message) => message.author.id === interaction.user.id,
      max: 1,
      time: QUESTION_TIMEOUT_MS,
    });

    const answer = collected.first()?.content.trim();

    if (!answer) {
      await interaction.followUp(
        'Binding setup collapsed because you took more than 20 seconds to answer...',
      );
      return null;
    }

    const matchedOption = this.matchOption(answer, question.options);

    if (!matchedOption) {
      await interaction.followUp(
        `Binding setup collapsed because \`${answer}\` is not one of the available options...`,
      );
      return null;
    }

    return matchedOption;
  }

  private createQuestionText(question: BindQuestion): string {
    return [
      `${question.prompt}`,
      `${question.options.map((option) => `→ ${option}`).join('\n')}`,
    ].join('\n\n');
  }

  private matchOption(
    answer: string,
    options: readonly string[],
  ): string | null {
    const normalizedAnswer = this.normalizeOption(answer);
    return (
      options.find(
        (option) => this.normalizeOption(option) === normalizedAnswer,
      ) ?? null
    );
  }

  private normalizeOption(value: string): string {
    return value
      .trim()
      .toLocaleLowerCase()
      .replace(/[`*_~]/g, '')
      .replace(/[\s_-]+/g, '');
  }

  private createBondageDescription(
    answers: { question: BindQuestion; answer: string }[],
  ): string {
    const selectedAnswers = answers.filter(
      ({ answer }) => this.normalizeOption(answer) !== 'skip',
    );
    const skippedTargets = answers
      .filter(({ answer }) => this.normalizeOption(answer) === 'skip')
      .map(({ question }) => question.target);

    const selectedLines = selectedAnswers.map(
      ({ question, answer }) => `- **${question.target}**: ${answer}`,
    );

    const skippedLine =
      skippedTargets.length > 0
        ? `\nSkipped: ${skippedTargets.join(', ')}`
        : '';

    return [
      'Your custom bondage session has started with these restraints:',
      ...selectedLines,
      skippedLine,
    ].join('\n');
  }

  private async createCageSession(
    interaction: ChatInputCommandInteraction,
    member: GuildMember,
    answers: { question: BindQuestion; answer: string }[],
  ): Promise<void> {
    const channel = await interaction.guild?.channels.create({
      name: `cage-${interaction.user.displayName}`,
      nsfw: true,
      type: 0,
      parent: '1497956351480041632',
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: ['ViewChannel'],
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages', 'UseApplicationCommands'],
        },
      ],
    });

    if (!channel) {
      await interaction.followUp({
        content: 'Error creating a new channel...',
        ephemeral: true,
      });
      return;
    }

    const bondageDescription = this.createBondageDescription(answers);

    const session = await this.bondageService.startSession(
      interaction.user.id,
      interaction?.guildId ?? '',
      channel?.id,
      member,
      bondageDescription,
    );

    const embed = createCustomSessionEmbed(session, answers);
    await member.roles.set([]);
    await member.roles.add('1497994703050903735');

    await channel.send(`Hello <@${interaction.user.id}>`);
    await channel.send({ embeds: [embed] });
  }
}
