import { IsEnum } from 'class-validator';

import { generateCurrencyEnum } from '@app/shared';

export class CurrencyParam {
  @IsEnum(generateCurrencyEnum())
  currency: string;
}
