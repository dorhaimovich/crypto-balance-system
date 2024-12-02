import { BalanceInfo } from './balance-info.interface';

export interface User {
  id: string;
  name: string;
  balances: BalanceInfo[];
}
