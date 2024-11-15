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
import { DataBaseFiles } from 'src/shared/constants/db-files.constants';
@Injectable()
export class BalancesService {
  users_balances_db = DataBaseFiles.USERS_BALANCES;
  constructor(private readonly DatabaseService: DatabaseService) {
    this.initDB();
  }

  private async initDB() {
    const users = await this.DatabaseService.getData(
      this.users_balances_db,
      '/users',
    );
    if (users == null) {
      await this.DatabaseService.setData(this.users_balances_db, '/users', []);
    }
  }

  private async getUserIndex(id: string, exception = UserNotFoundException) {
    const userIndex = await this.DatabaseService.getArrayIndex(
      this.users_balances_db,
      '/users',
      id,
    );
    if (userIndex == null) {
      throw new exception(id);
    }
    return userIndex;
  }

  private async getBalanceIndex(userIndex: number, asset: string) {
    const balanceIndex = await this.DatabaseService.getArrayIndex(
      this.users_balances_db,
      `/users[${userIndex}]/balances`,
      asset,
      'asset',
    );
    if (balanceIndex == null) {
      throw new IdentifierNotFoundException(asset); // change to coin type not found
    }
    return balanceIndex;
  }

  async getAllBalances(id: string) {
    const userIndex = await this.getUserIndex(id);

    return await this.DatabaseService.getData(
      this.users_balances_db,
      `/users[${userIndex}]/balances`,
    );
  }

  async getOneBalance(id: string, asset: string) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, asset);

    return await this.DatabaseService.getData(
      this.users_balances_db,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
    );
  }

  async createBalance(id: string, createBalanceDto: CreateBalanceDto) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.DatabaseService.getArrayIndex(
      this.users_balances_db,
      `/users[${userIndex}]/balances`,
      createBalanceDto.asset,
      'asset',
    );
    if (balanceIndex !== null) {
      throw new AssetAlreadyExistException(createBalanceDto.asset); // change to coin type not found
    }

    return await this.DatabaseService.setData(
      this.users_balances_db,
      `/users[${userIndex}]/balances[]`,
      createBalanceDto,
    );
  }

  async addBalance(
    id: string,
    asset: string,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, asset);

    const amount = await this.DatabaseService.getData(
      this.users_balances_db,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
    );
    if (amount === null) {
      throw new NotFoundException(); // changed to specific exception
    }
    if (typeof amount !== 'number') {
      throw new Error(); // changed it
    }

    return await this.DatabaseService.setData(
      this.users_balances_db,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      amount + updateBalanceDto.amount,
    );
  }

  async substractBalance(
    id: string,
    asset: string,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, asset);

    const amount = await this.DatabaseService.getData(
      this.users_balances_db,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
    );
    if (amount === null) {
      throw new NotFoundException(); // changed to specific exception
    }
    if (typeof amount !== 'number') {
      throw new Error(); // changed it
    }
    if (amount < updateBalanceDto.amount) {
      throw new InsufficientBalanceException(amount, asset);
    }
    return await this.DatabaseService.setData(
      this.users_balances_db,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      amount - updateBalanceDto.amount,
    );
  }

  async setBalance(
    id: string,
    asset: string,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, asset);

    return await this.DatabaseService.setData(
      this.users_balances_db,
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      updateBalanceDto.amount,
    );
  }

  async deleteBalance(id: string, asset: string) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, asset);

    return await this.DatabaseService.removeData(
      this.users_balances_db,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
    );
  }
}
