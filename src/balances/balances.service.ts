import { Injectable } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { ChangeBalanceDto } from './dto/change-balance.dto';
import { DatabaseService } from './../database/database.service';
import { BalanceIdentifier } from './balances.controller';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import {
  AssetAlreadyExistException,
  IdentifierNotFoundException,
  UserNotFoundException,
} from 'src/shared/exceptions/http-exceptions';
@Injectable()
export class BalancesService {
  users_balances_db = 'src/database/data/users-balances';
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

  async changeBalance(
    id: string,
    asset: BalanceIdentifier,
    changeBalanceDto: ChangeBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, asset);

    return await this.DatabaseService.setData(
      this.users_balances_db,
      `/users[${userIndex}]/balances[${balanceIndex}]`,
      changeBalanceDto,
    );
  }

  async addBalance(
    id: string,
    identifier: BalanceIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.DatabaseService.addUserBalance(
      id,
      identifier,
      updateBalanceDto,
    );
  }

  async substractBalance(
    id: string,
    identifier: BalanceIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.DatabaseService.substractUserBalance(
      id,
      identifier,
      updateBalanceDto,
    );
  }

  async setBalance(
    id: string,
    identifier: BalanceIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.DatabaseService.setUserBalance(
      id,
      identifier,
      updateBalanceDto,
    );
  }

  async deleteBalance(id: string, identifier: BalanceIdentifier) {
    return this.DatabaseService.deleteUserBalance(id, identifier);
  }
}
