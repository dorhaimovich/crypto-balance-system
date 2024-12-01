import { generateCurrencyEnum } from '@app/shared';
import { IsEnum } from 'class-validator';

export class CurrencyParam {
  @IsEnum(generateCurrencyEnum())
  currency: string;
}
