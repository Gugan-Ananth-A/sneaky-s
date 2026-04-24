import { Choice, Param, ParamType } from '@discord-nestjs/core';
import { Yno } from './yno';

export class SettingsDto {
  @Choice(Yno)
  @Param({
    name: 'gag',
    type: ParamType.INTEGER,
    required: false,
    description: 'If you want to get gagged or not? (default: false)',
  })
  gag?: number;

  @Choice(Yno)
  @Param({
    name: 'blindfold',
    type: ParamType.INTEGER,
    required: false,
    description: 'If you want to get blindfolded or not? (default: false)',
  })
  blindfold?: number;

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
