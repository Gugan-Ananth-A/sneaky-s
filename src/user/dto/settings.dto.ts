import { Param, ParamType } from '@discord-nestjs/core';

export class SettingsDto {
  @Param({
    name: 'duration',
    type: ParamType.INTEGER,
    required: false,
    description:
      'Duration in minutes you want to stay tied up (default: 30 mins)',
  })
  duration?: number;

  @Param({
    name: 'safeword',
    type: ParamType.STRING,
    required: false,
    description: 'Safeword (default is red)',
  })
  safeword?: string;
}
