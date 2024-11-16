import { z } from 'zod';

export const CoinEnum = z.enum([
  'tether',
  'ethereum',
  'bitcoin',
  'binancecoin',
  'usd-coin',
  'ripple',
  'cardano',
  'binance-usd',
  'solana',
  'polkadot',
]);

export type Coin = z.infer<typeof CoinEnum>;
