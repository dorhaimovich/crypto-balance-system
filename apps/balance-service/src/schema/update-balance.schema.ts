import { z } from 'zod';

export const updateBalanceSchema = z
  .object({
    amount: z.number().nonnegative(),
  })
  .required();

export type UpdateBalanceDto = z.infer<typeof updateBalanceSchema>;
