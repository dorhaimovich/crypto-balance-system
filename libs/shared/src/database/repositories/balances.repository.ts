import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database.service';
import { Balance } from '../entities/balance.entity';
import { Amount } from '../entities/amount.entity';

import {
  BalanceInfo,
  User,
  DataBaseFiles,
  CoinAlreadyExistException,
  CoinNotFoundException,
  UserNotFoundException,
} from '@app/shared';

@Injectable()
export class BalancesRepository {
  private readonly dbName: string = DataBaseFiles.USERS_BALANCES;

  constructor(private readonly DatabaseService: DatabaseService) {}

  async onModuleInit() {
    await this.initDB();
  }

  private async initDB(): Promise<void> {
    try {
      await this.DatabaseService.getData<User[]>(this.dbName, '/users');
    } catch {
      await this.DatabaseService.setData<User[]>(this.dbName, '/users', []);
    }
  }

  private async getUserIndex(id: string): Promise<number> {
    const userIndex = await this.DatabaseService.getArrayIndex(
      this.dbName,
      '/users',
      id,
    );
    if (userIndex == null) {
      throw new UserNotFoundException(id);
    }
    return userIndex;
  }

  private async getBalanceIndex(
    userIndex: number,
    coin: string,
  ): Promise<number> {
    const balanceIndex = await this.DatabaseService.getArrayIndex(
      this.dbName,
      `/users[${userIndex}]/balances`,
      coin,
      'coin',
    );
    if (balanceIndex == null) {
      throw new CoinNotFoundException(coin);
    }
    return balanceIndex;
  }

  async getAllBalances(id: string): Promise<BalanceInfo[]> {
    const userIndex = await this.getUserIndex(id);

    return await this.DatabaseService.getData<BalanceInfo[]>(
      this.dbName,
      `/users[${userIndex}]/balances`,
    );
  }

  async getOneBalance(id: string, coin: string): Promise<BalanceInfo> {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    return await this.DatabaseService.getData<BalanceInfo>(
      this.dbName,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
    );
  }

  async createBalance(id: string, newBalance: Balance): Promise<BalanceInfo> {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.DatabaseService.getArrayIndex(
      this.dbName,
      `/users[${userIndex}]/balances`,
      newBalance.coin,
      'coin',
    );

    if (balanceIndex !== null) {
      throw new CoinAlreadyExistException(newBalance.coin);
    }

    return await this.DatabaseService.setData<BalanceInfo>(
      this.dbName,
      `/users[${userIndex}]/balances[]`,
      newBalance,
    );
  }

  async changeBalance(
    id: string,
    coin: string,
    amount: Amount,
  ): Promise<BalanceInfo> {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    const balance = await this.DatabaseService.getData<BalanceInfo>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
    );

    balance.amount += amount.amount;

    await this.DatabaseService.setData<number>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      balance.amount,
    );

    return balance;
  }

  async setBalances(
    id: string,
    balances: BalanceInfo[],
  ): Promise<BalanceInfo[]> {
    const userIndex = await this.getUserIndex(id);

    await this.DatabaseService.setData<BalanceInfo[]>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances`,
      balances,
    );

    return balances;
  }

  async deleteBalance(id: string, coin: string): Promise<BalanceInfo> {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    return await this.DatabaseService.removeData<BalanceInfo>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
    );
  }
}
