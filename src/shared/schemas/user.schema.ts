import { createBalanceSchema } from 'src/balances/schema/create-balance.schema';
import { z } from 'zod';

export const userSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    balances: z.array(createBalanceSchema),
  })
  .required();

export type User = z.infer<typeof userSchema>;
