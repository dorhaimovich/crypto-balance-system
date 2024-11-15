import { IsIn, IsNotEmpty, IsString, Min } from 'class-validator';
import { Constants as c } from 'src/shared/constants';
import { Coin } from 'src/shared/types';

export class CreateBalanceDto {
  @IsIn(c.COINS_LIST)
  coin: Coin;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @Min(0)
  @IsNotEmpty()
  amount: number;
}
