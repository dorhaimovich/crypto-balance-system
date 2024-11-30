import { Coin } from '../types/coin.type';

export interface BalanceInfo {
  coin: Coin;
  symbol: string;
  amount: number;
}
