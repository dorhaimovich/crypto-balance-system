import { createBalanceSchema } from 'apps/balance-service/src/schema/create-balance.schema';
import { z } from 'zod';

export const userSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    balances: z.array(createBalanceSchema),
  })
  .required();

export type User = z.infer<typeof userSchema>;
