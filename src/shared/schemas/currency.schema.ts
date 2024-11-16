import { z } from 'zod';

import * as fs from 'fs';
import * as path from 'path';

const getCoinsFromJson = (): [string] => {
  const currenciesPath = path.resolve(
    process.cwd(),
    'data/supported-vs-currencies.json',
  );

  const rawData = fs.readFileSync(currenciesPath, 'utf-8');
  const parsedData = JSON.parse(rawData);
  return parsedData.currencies;
};

export const generateCurrencyEnum = (): z.ZodEnum<[string, ...string[]]> => {
  return z.enum(getCoinsFromJson());
};

export const CurrencyEnum = generateCurrencyEnum();
export type Currency = z.infer<typeof CurrencyEnum>;
