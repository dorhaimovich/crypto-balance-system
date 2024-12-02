import { IsString, IsEnum, IsNumber, Min, Validate } from 'class-validator';
import { CoinSymbolMatchValidator } from '../validators/coin-symbol-match.validator';
import { Constants as c, Coin } from '@app/shared';

export class CreateBalanceDto {
  @IsEnum(c.COINS_LIST)
  coin: Coin;

  @Validate(CoinSymbolMatchValidator)
  @IsString()
  symbol: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
