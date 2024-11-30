import { Constants as c } from '@app/shared/constants';

import { z } from 'zod';

export const createBalanceSchema = z
  .object({
    coin: z.enum(c.COINS_LIST),
    symbol: z.string(),
    amount: z.number().nonnegative(),
  })
  .required()
  .refine((data) => c.COINS_SYMBOL_MAP[data.coin] === data.symbol, {
    message: 'The symbol does not match the coin',
  });

export type CreateBalanceDto = z.infer<typeof createBalanceSchema>;
