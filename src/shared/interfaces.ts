import { Coin } from './types';

export interface BalanceInfo {
  coin: Coin;
  symbol: string;
  amount: number;
}

export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
}
