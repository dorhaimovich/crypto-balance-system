import { IsEnum } from 'class-validator';

import { Constants as c } from '@app/shared';

export class CoinParam {
  @IsEnum(c.COINS_LIST)
  coin: string;
}
