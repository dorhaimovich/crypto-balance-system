import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import * as path from 'path';
import * as fs from 'fs';
import { LoggerService } from 'src/logger/logger.service';
@Injectable()
export class DatabaseService {
  private readonly logger = new LoggerService(DatabaseService.name);
  private dbInstances: Map<string, JsonDB> = new Map();

  private async getDbInstance(filename: string): Promise<JsonDB> {
    if (this.dbInstances.has(filename)) {
      return this.dbInstances.get(filename);
    }

    try {
      const dataDir = path.resolve(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        await fs.promises.mkdir(dataDir);
      }

      const db = new JsonDB(
        new Config(path.join(dataDir, filename), true, false, '/'),
      );

      this.dbInstances.set(filename, db);
      return db;
    } catch (err) {
      this.logger.log(
        err,
        `${DatabaseService.name}.${this.getDbInstance.name}`,
      );
      // Throw error while connecting to db
    }

    return this.dbInstances.get(filename);
  }

  async getData(filename: string, path: string) {
    try {
      const db = await this.getDbInstance(filename);
      const data = await db.getData(path);
      return data;
    } catch (error) {
      this.logger.error(error, `${DatabaseService.name}.${this.getData.name}`);
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
      const db = await this.getDbInstance(filename);
      const index = await db.getIndex(path, value, key);
      if (index == -1) return null;
      return index;
    } catch (error) {
      this.logger.error(
        error,
        `${DatabaseService.name}.${this.getArrayIndex.name}`,
      );
      return null;
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
      this.logger.error(error, `${DatabaseService.name}.${this.setData.name}`);
      return null;
    }
  }

  async removeData(filename: string, path: string) {
    try {
      const db = await this.getDbInstance(filename);
      const data = await db.getData(path);
      await db.delete(path);
      return data;
    } catch (error) {
      this.logger.error(
        error,
        `${DatabaseService.name}.${this.removeData.name}`,
      );
      return null;
    }
  }
}
