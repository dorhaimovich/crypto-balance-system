import { Coin } from './schemas/coin.schema';

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

export interface BalacesApiHeader {
  'x-user-id': string;
}

export interface ExceptionsResponseObject {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  response: string | object;
}
