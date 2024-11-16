import { z } from 'zod';
import { Constants as c } from 'src/shared/constants';

export const coinsPercentagesSchema = z
  .record(z.enum(c.COINS_LIST), z.number().min(0).max(100))
  .refine(
    (data) => {
      const sum = Object.values(data).reduce((acc, val) => acc + val, 0);
      return sum === 100; // Custom validation to check if the sum equals 100
    },
    {
      message: 'The sum of all percentages must equcccal 100.',
    },
  );

export type CoinsPercentagesDto = z.infer<typeof coinsPercentagesSchema>;
