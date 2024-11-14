import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';

@Injectable()
export class DatabaseService {
  private dbInstances: Map<string, JsonDB> = new Map();

  private getDbInstance(filename: string): JsonDB {
    if (!this.dbInstances.has(filename)) {
      const db = new JsonDB(new Config(filename, true, true, '/'));
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

  async removeData(filename: string, path: string) {
    try {
      const db = this.getDbInstance(filename);
      const data = await db.getData(path);
      await db.delete(path);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
