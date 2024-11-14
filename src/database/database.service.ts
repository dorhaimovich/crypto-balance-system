import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import { BalanceIdentifier } from 'src/balances/balances.controller';
import { ChangeBalanceDto } from 'src/balances/dto/change-balance.dto';
import { UpdateBalanceDto } from 'src/balances/dto/update-balance.dto';
import {
  UserNotFoundException,
  IdentifierNotFoundException,
  InsufficientBalanceException,
} from 'src/shared/exceptions/http-exceptions';

@Injectable()
export class DatabaseService {
  private dbInstances: Map<string, JsonDB> = new Map();

  private getDbInstance(filename: string): JsonDB {
    if (!this.dbInstances.has(filename)) {
      const db = new JsonDB(new Config(filename, true, false, '/'));
      this.dbInstances.set(filename, db);
    }
    return this.dbInstances.get(filename);
  }

  async getData(filename: string, path: string) {
    try {
      const db = this.getDbInstance(filename);
      const data = await db.getData(path);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getArrayIndex(
    filename: string,
    path: string,
    value: any,
    key: string = 'id',
  ): Promise<number | null> {
    try {
      const db = this.getDbInstance(filename);
      const index = await db.getIndex(path, value, key);
      if (index == -1) return null;
      return index;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async setData(
    filename: string,
    path: string,
    data: any,
  ): Promise<void | null> {
    try {
      const db = this.getDbInstance(filename);
      db.push(path, data);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
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
