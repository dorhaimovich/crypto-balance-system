import { Injectable } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { DatabaseService } from '@app/shared/database/database.service';
import { DataBaseFiles } from '@app/shared/db-files';
import {
  CoinAlreadyExistException,
  CoinNotFoundException,
  InsufficientBalanceException,
  UserNotFoundException,
} from '@app/shared/exceptions/http.exceptions';
import { BalanceInfo, User } from '@app/shared';
import { RebalanceDto } from './dto/rebalance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Injectable()
export class BalanceServiceService {
  constructor(
    private readonly DatabaseService: DatabaseService,
    // private readonly ratesService: RatesService,
  ) {}

  async onModuleInit() {
    await this.initDB();
  }

  private async initDB(): Promise<void> {
    try {
      await this.DatabaseService.getData<User[]>(
        DataBaseFiles.USERS_BALANCES,
        '/users',
      );
    } catch {
      await this.DatabaseService.setData<User[]>(
        DataBaseFiles.USERS_BALANCES,
        '/users',
        [],
      );
    }
  }

  private async getUserIndex(id: string): Promise<number> {
    const userIndex = await this.DatabaseService.getArrayIndex(
      DataBaseFiles.USERS_BALANCES,
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
      DataBaseFiles.USERS_BALANCES,
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
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances`,
    );
  }

  async getOneBalance(id: string, coin: string): Promise<BalanceInfo> {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    return await this.DatabaseService.getData<BalanceInfo>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
    );
  }

  // async getTotalBalances(
  //   id: string,
  //   currency: string,
  // ): Promise<Record<Currency, number>> {
  //   const userIndex = await this.getUserIndex(id);
  //   const balances = await this.DatabaseService.getData<BalanceInfo[]>(
  //     DataBaseFiles.USERS_BALANCES,
  //     `/users[${userIndex}]/balances`,
  //   );
  //   const rates = await this.ratesService.getRates(
  //     currency,
  //     balances.map((balance) => balance.coin),
  //   );

  //   const total = balances.reduce((sum, balance) => {
  //     return sum + rates[balance.coin] * balance.amount;
  //   }, 0);

  //   return { [currency]: total };
  // }

  // clean that method
  async rebalance(
    id: string,
    targetPercentages: RebalanceDto,
  ): Promise<BalanceInfo[]> {
    const userIndex = await this.getUserIndex(id);

    const balances = await this.DatabaseService.getData<BalanceInfo[]>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances`,
    );
    // const rates = await this.ratesService.getRates(
    //   'usd',
    //   balances.map((balance) => balance.coin),
    // );

    // const total = balances.reduce((sum, balance) => {
    //   return sum + rates[balance.coin] * balance.amount;
    // }, 0);

    // for (const balance of balances) {
    //   const updateBalance: UpdateBalanceDto = {};
    //   updateBalance.amount =
    //     (total * (targetPercentages[balance.coin] / 100)) / rates[balance.coin];

    //   await this.setBalance(id, balance.coin, updateBalance);
    // }

    return await this.getAllBalances(id);
  }

  async createBalance(
    id: string,
    createBalanceDto: CreateBalanceDto,
  ): Promise<CreateBalanceDto> {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.DatabaseService.getArrayIndex(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances`,
      createBalanceDto.coin,
      'coin',
    );
    if (balanceIndex !== null) {
      throw new CoinAlreadyExistException(createBalanceDto.coin); // change to coin type not found
    }

    return await this.DatabaseService.setData<CreateBalanceDto>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[]`,
      createBalanceDto,
    );
  }

  async addBalance(
    id: string,
    coin: string,
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<BalanceInfo> {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    const balance = await this.DatabaseService.getData<BalanceInfo>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
    );

    balance.amount += updateBalanceDto.amount;

    await this.DatabaseService.setData<number>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      balance.amount,
    );

    return balance;
  }

  async substractBalance(
    id: string,
    coin: string,
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<BalanceInfo> {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    const balance = await this.DatabaseService.getData<BalanceInfo>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
    );

    if (balance.amount < updateBalanceDto.amount) {
      throw new InsufficientBalanceException(coin);
    }

    balance.amount -= updateBalanceDto.amount;

    await this.DatabaseService.setData<number>(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      balance.amount,
    );

    return balance;
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
