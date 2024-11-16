import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import * as path from 'path';
import { LoggerService } from 'src/logger/logger.service';
import { DataBaseException } from 'src/shared/exceptions/database.exceptions';
import { getDirPath } from 'src/shared/utils';
@Injectable()
export class DatabaseService {
  private readonly logger = new LoggerService(DatabaseService.name);
  private dbInstances: Map<string, JsonDB> = new Map();

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
      this.logger.log(error, this.getDbInstance.name);
      throw new DataBaseException(error.message);
    }
  }

  async getData(filename: string, path: string) {
    try {
      const db = await this.getDbInstance(filename);
      const data = await db.getData(path);
      return data;
    } catch (error) {
      this.logger.error(error, this.getData.name);
      throw new DataBaseException(error.message);
    }
  }

  async getArrayIndex(
    filename: string,
    path: string,
    value: any,
    key: string = 'id',
  ): Promise<number | null> {
    try {
      const db = await this.getDbInstance(filename);
      const index = await db.getIndex(path, value, key);
      if (index == -1) return null;
      return index;
    } catch (error) {
      this.logger.error(error, this.getArrayIndex.name);
      throw new DataBaseException(error.message);
    }
  }

  async setData(
    filename: string,
    path: string,
    data: any,
  ): Promise<void | null> {
    try {
      const db = await this.getDbInstance(filename);
      db.push(path, data);
      return data;
    } catch (error) {
      this.logger.error(error, this.setData.name);
      throw new DataBaseException(error.message);
    }
  }

  async removeData(filename: string, path: string) {
    try {
      const db = await this.getDbInstance(filename);
      const data = await db.getData(path);
      await db.delete(path);
      return data;
    } catch (error) {
      this.logger.error(error, this.removeData.name);
      throw new DataBaseException(error.message);
    }
  }
}
