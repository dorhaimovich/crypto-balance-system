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

export const generateCurrencyEnum = (): string[] => {
  return getCoinsFromJson();
};

const supportedCurrencies = generateCurrencyEnum();
export type Currency = (typeof supportedCurrencies)[number];
