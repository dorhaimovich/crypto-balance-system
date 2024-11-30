import { Coin } from '../schemas/coin.schema';

export interface BalanceInfo {
  coin: Coin;
  symbol: string;
  amount: number;
}
