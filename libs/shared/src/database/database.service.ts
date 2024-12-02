import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import * as path from 'path';
import { LoggerService } from '../logger/logger.service';
import { getDirPath, formatName } from '../utils';
import {
  DBInstanceCreationFailedException,
  GetDataException,
  RemoveDataException,
  SetDataException,
} from '../exceptions/database.exceptions';

@Injectable()
export class DatabaseService {
  private dbInstances: Map<string, JsonDB> = new Map();

  constructor(private readonly loggerService: LoggerService) {}

  private async getDbInstance(filename: string): Promise<JsonDB> {
    if (this.dbInstances.has(filename)) {
      return this.dbInstances.get(filename);
    }

    try {
      const dataDir = await getDirPath('data');
      const db = new JsonDB(
        new Config(path.join(dataDir, filename), true, false, '/'),
      );
      this.dbInstances.set(filename, db);

      return db;
    } catch (error) {
      this.loggerService.error(
        error,
        formatName(DatabaseService.name, this.getDbInstance.name),
      );
      throw new DBInstanceCreationFailedException();
    }
  }

  async getData<T>(filename: string, path: string): Promise<T> {
    const db = await this.getDbInstance(filename);

    try {
      const data: T = await db.getData(path);
      return data;
    } catch (error) {
      this.loggerService.error(
        error,
        formatName(DatabaseService.name, this.getData.name),
      );
      throw new GetDataException();
    }
  }

  async getArrayIndex(
    filename: string,
    path: string,
    value: any,
    key: string = 'id',
  ): Promise<number> {
    const db = await this.getDbInstance(filename);

    try {
      const index = await db.getIndex(path, value, key);
      if (index == -1) return null;
      return index;
    } catch (error) {
      this.loggerService.error(
        error,
        formatName(DatabaseService.name, this.getArrayIndex.name),
      );
      throw new GetDataException();
    }
  }

  async setData<T>(filename: string, path: string, data: T): Promise<T> {
    const db = await this.getDbInstance(filename);

    try {
      db.push(path, data);
      return data;
    } catch (error) {
      this.loggerService.error(
        error,
        formatName(DatabaseService.name, this.setData.name),
      );
      throw new SetDataException();
    }
  }

  async removeData<T>(filename: string, path: string): Promise<T> {
    const db = await this.getDbInstance(filename);

    try {
      const data: T = await db.getData(path);
      await db.delete(path);
      return data;
    } catch (error) {
      this.loggerService.error(
        error,
        formatName(DatabaseService.name, this.removeData.name),
      );
      throw new RemoveDataException();
    }
  }
}
