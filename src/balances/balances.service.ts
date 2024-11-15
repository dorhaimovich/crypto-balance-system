import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { DatabaseService } from './../database/database.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import {
  AssetAlreadyExistException,
  IdentifierNotFoundException,
  InsufficientBalanceException,
  UserNotFoundException,
} from 'src/shared/exceptions/http-exceptions';
import { DataBaseFiles } from 'src/shared/db-files';
import { RatesService } from 'src/rates/rates.service';
import { BalanceInfo } from 'src/shared/interfaces';

@Injectable()
export class BalancesService {
  constructor(
    private readonly DatabaseService: DatabaseService,
    private readonly ratesService: RatesService,
  ) {
    this.initDB();
  }

  private async initDB() {
    const users = await this.DatabaseService.getData(
      DataBaseFiles.USERS_BALANCES,
      '/users',
    );
    if (users == null) {
      await this.DatabaseService.setData(
        DataBaseFiles.USERS_BALANCES,
        '/users',
        [],
      );
    }
  }

  private async getUserIndex(id: string, exception = UserNotFoundException) {
    const userIndex = await this.DatabaseService.getArrayIndex(
      DataBaseFiles.USERS_BALANCES,
      '/users',
      id,
    );
    if (userIndex == null) {
      throw new exception(id);
    }
    return userIndex;
  }

  private async getBalanceIndex(userIndex: number, coin: string) {
    const balanceIndex = await this.DatabaseService.getArrayIndex(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances`,
      coin,
      'coin',
    );
    if (balanceIndex == null) {
      throw new IdentifierNotFoundException(coin); // change to coin type not found
    }
    return balanceIndex;
  }

  async getAllBalances(id: string) {
    const userIndex = await this.getUserIndex(id);

    return await this.DatabaseService.getData(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances`,
    );
  }

  async getOneBalance(id: string, coin: string) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    return await this.DatabaseService.getData(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
    );
  }

  async getTotalBalances(id: string, currency: string): Promise<number> {
    const userIndex = await this.getUserIndex(id);
    const balances: BalanceInfo[] = await this.DatabaseService.getData(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances`,
    );
    const rates = await this.ratesService.getRates(
      currency,
      balances.map((x) => x.coin),
    );

    const x = balances.reduce((sum, balance) => {
      return sum + rates[balance.coin] * balance.amount;
    }, 0);
    return x;
  }

  async createBalance(id: string, createBalanceDto: CreateBalanceDto) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.DatabaseService.getArrayIndex(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances`,
      createBalanceDto.coin,
      'coin',
    );
    if (balanceIndex !== null) {
      throw new AssetAlreadyExistException(createBalanceDto.coin); // change to coin type not found
    }

    return await this.DatabaseService.setData(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[]`,
      createBalanceDto,
    );
  }

  async addBalance(
    id: string,
    coin: string,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    const amount = await this.DatabaseService.getData(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
    );
    if (amount === null) {
      throw new NotFoundException(); // changed to specific exception
    }
    if (typeof amount !== 'number') {
      throw new Error(); // changed it
    }

    return await this.DatabaseService.setData(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      amount + updateBalanceDto.amount,
    );
  }

  async substractBalance(
    id: string,
    coin: string,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    const amount = await this.DatabaseService.getData(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
    );
    if (amount === null) {
      throw new NotFoundException(); // changed to specific exception
    }
    if (typeof amount !== 'number') {
      throw new Error(); // changed it
    }
    if (amount < updateBalanceDto.amount) {
      throw new InsufficientBalanceException(amount, coin);
    }
    return await this.DatabaseService.setData(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      amount - updateBalanceDto.amount,
    );
  }

  async setBalance(
    id: string,
    coin: string,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    return await this.DatabaseService.setData(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      updateBalanceDto.amount,
    );
  }

  async deleteBalance(id: string, coin: string) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, coin);

    return await this.DatabaseService.removeData(
      DataBaseFiles.USERS_BALANCES,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
    );
  }
}
