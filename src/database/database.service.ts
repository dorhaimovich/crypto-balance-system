import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import { BalanceIdentifier } from 'src/balances/balances.controller';
import { ChangeBalanceDto } from 'src/balances/dto/change-balance.dto';
import { CreateBalanceDto } from 'src/balances/dto/create-balance.dto';
import { UpdateBalanceDto } from 'src/balances/dto/update-balance.dto';
import {
  AssetAlreadyExistException,
  UserAlreadyExistException,
  UserNotFoundException,
  IdentifierNotFoundException,
  CurrencyAlreadyExistException,
  InsufficientBalanceException,
} from 'src/shared/exceptions/http-exceptions';

@Injectable()
export class DatabaseService {
  private db: JsonDB;

  constructor() {
    this.db = new JsonDB(
      new Config('src/database/data/users-balances', true, true, '/'),
    );
    this.createUsersArrayIfNotExist();
  }

  private async createUsersArrayIfNotExist() {
    try {
      await this.db.getData('/users');
    } catch {
      this.db.push('/users', []);
    }
  }

  private async getUserIndex(id: string, exception = UserNotFoundException) {
    const userIndex = await this.db.getIndex('/users', id);
    if (userIndex === -1) throw new exception(id);

    return userIndex;
  }

  private async getBalanceIndex(userIndex: number, identifier: string) {
    let balanceIndex = await this.db.getIndex(
      `/users[${userIndex}]/balances`,
      identifier,
      'asset',
    );
    if (balanceIndex === -1) {
      balanceIndex = await this.db.getIndex(
        `/users[${userIndex}]/balances`,
        identifier,
        'currency',
      );
    }
    if (balanceIndex === -1) throw new IdentifierNotFoundException(identifier);

    return balanceIndex;
  }
  // not used uet, waiting for questions answering
  async createUser(user: {
    id: string;
    name: string;
    balances: CreateBalanceDto[];
  }) {
    const userIndex = await this.db.getIndex('/users', user.id);
    if (userIndex !== -1) throw new UserAlreadyExistException(user.id);

    this.db.push('/users[]', user);
  }

  async getAllUserBalances(id: string) {
    const userIndex = await this.getUserIndex(id);

    return this.db.getData(`/users[${userIndex}]/balances`);
  }

  async getOneUserBalance(id: string, identifier: BalanceIdentifier) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, identifier);

    return this.db.getData(`/users[${userIndex}]/balances[${balanceIndex}]`);
  }

  // TODO: test it
  async createUserBalance(id: string, createBalanceDto: CreateBalanceDto) {
    const userIndex = await this.getUserIndex(id);

    let balanceIndex = await this.db.getIndex(
      `/users[${userIndex}]/balances`,
      createBalanceDto.asset,
      'asset',
    );
    if (balanceIndex != -1)
      throw new AssetAlreadyExistException(createBalanceDto.asset);

    balanceIndex = await this.db.getIndex(
      `/users[${userIndex}]/balances`,
      createBalanceDto.currency,
      'currency',
    );
    if (balanceIndex != -1)
      throw new CurrencyAlreadyExistException(createBalanceDto.currency);

    this.db.push(`/users[${userIndex}]/balances[]`, createBalanceDto);
  }

  async changeUserBalance(
    id: string,
    identifier: BalanceIdentifier,
    changeBalanceDto: ChangeBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, identifier);

    this.db.push(
      `/users[${userIndex}]/balances[${balanceIndex}]`,
      changeBalanceDto,
    );
  }

  async addUserBalance(
    id: string,
    identifier: BalanceIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, identifier);

    const newAmount =
      (await this.db.getData(
        `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      )) + updateBalanceDto.amount;

    this.db.push(
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      newAmount,
    );
    return newAmount;
  }

  async substractUserBalance(
    id: string,
    identifier: BalanceIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, identifier);

    const newAmount =
      (await this.db.getData(
        `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      )) - updateBalanceDto.amount;

    if (newAmount < 0) {
      throw new InsufficientBalanceException(
        newAmount + updateBalanceDto.amount,
        identifier,
      );
    }
    this.db.push(
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      newAmount,
    );
    return newAmount;
  }

  async setUserBalance(
    id: string,
    identifier: BalanceIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, identifier);

    this.db.push(
      `/users[${userIndex}]/balances[${balanceIndex}]/amount`,
      updateBalanceDto.amount,
    );

    return updateBalanceDto.amount;
  }

  async deleteUserBalance(id: string, identifier: BalanceIdentifier) {
    const userIndex = await this.getUserIndex(id);
    const balanceIndex = await this.getBalanceIndex(userIndex, identifier);

    await this.db.delete(`/users[${userIndex}]/balances[${balanceIndex}]`);
  }
}
