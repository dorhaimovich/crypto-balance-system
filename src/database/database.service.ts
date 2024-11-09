import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import { UpdateIdentifier } from 'src/balances/balances.controller';
import { CreateBalanceDto } from 'src/balances/dto/create-balance.dto';
import { UpdateBalanceDto } from 'src/balances/dto/update-balance.dto';
import {
  AssetAlreadyExistException,
  AssetNotFoundException,
  UserAlreadyExistException,
  UserNotFoundException,
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
    const userIndex = await this.db.getIndex('/users', id);
    if (userIndex === -1) throw new UserNotFoundException(id);

    return this.db.getData(`/users[${userIndex}]/balances`);
  }

  async getOneUserBalancesByAsset(id: string, asset: string) {
    const userIndex = await this.db.getIndex('/users', id);
    if (userIndex === -1) throw new UserNotFoundException(id);

    const balanceIndex = await this.db.getIndex(
      `/users[${userIndex}]/balances`,
      asset,
      'asset',
    );
    if (balanceIndex === -1) throw new AssetNotFoundException(id);

    return this.db.getData(`/users[${userIndex}]/balances[${balanceIndex}]`);
  }

  // TODO: test it
  async createUserBalance(id: string, createBalanceDto: CreateBalanceDto) {
    const userIndex = await this.db.getIndex('/users', id);
    if (userIndex === -1) throw new UserNotFoundException(id);

    const balanceIndex = await this.db.getIndex(
      `/users[${userIndex}]/balances`,
      createBalanceDto.asset,
      'asset',
    );
    if (balanceIndex != -1)
      throw new AssetAlreadyExistException(createBalanceDto.asset);

    this.db.push(`/users[${userIndex}]/balances[]`, createBalanceDto);
  }

  async updateUserBalance(
    id: string,
    identifier: UpdateIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    const userIndex = await this.db.getIndex('/users', id);
    if (userIndex === -1) throw new UserNotFoundException(id);

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
    if (balanceIndex === -1) throw new AssetNotFoundException(identifier);

    this.db.push(
      `/users[${userIndex}]/balances[${balanceIndex}]`,
      updateBalanceDto,
    );
  }

  async deleteUserBalance(id: string, identifier: UpdateIdentifier) {
    const userIndex = await this.db.getIndex('/users', id);
    if (userIndex === -1) throw new UserNotFoundException(id);

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
    if (balanceIndex === -1) throw new AssetNotFoundException(identifier);

    await this.db.delete(`/users[${userIndex}]/balances[${balanceIndex}]`);
  }
}
