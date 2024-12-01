import { Constants as c } from '@app/shared/constants';
import { Coin } from '@app/shared/types/coin.type';
import { IsString, IsEnum, IsNumber, Min, Validate } from 'class-validator';
import { CoinSymbolMatchValidator } from '../validators/coin-symbol-match.validator';

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
