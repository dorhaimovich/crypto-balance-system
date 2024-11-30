import { Constants as c } from '@app/shared/constants';
import { IsEnum } from 'class-validator';

export class CoinParam {
  @IsEnum(c.COINS_LIST)
  coin: string;
}
