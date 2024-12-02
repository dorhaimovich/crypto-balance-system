import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Cache } from 'cache-manager';

import { DatabaseService } from '../database.service';

import { DataBaseFiles, Coin, Currency } from '@app/shared';

@Injectable()
export class RatesRepository {
  private readonly dbName: string = DataBaseFiles.RATES;

  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllRates() {
    const rates: Partial<Record<Coin, number>> = {};

    let allRates =
      await this.cacheManager.get<Record<Coin, Record<Currency, number>>>(
        'all-rates',
      );

    if (!allRates) {
      const rates = await this.databaseService.getData<
        Record<Coin, Record<Currency, number>>
      >(this.dbName, `/`);

      await this.cacheManager.set('all-rates', rates);
      allRates = rates;
    }

    return rates;
  }

  async getRatesByCurrencyAndCoins(
    currency: string,
    coinIds: Coin[],
  ): Promise<Partial<Record<Coin, number>>> {
    const rates: Partial<Record<Coin, number>> = {};

    let allRates =
      await this.cacheManager.get<Record<Coin, Record<Currency, number>>>(
        'all-rates',
      );

    if (!allRates) {
      const rates = await this.databaseService.getData<
        Record<Coin, Record<Currency, number>>
      >(this.dbName, `/`);

      await this.cacheManager.set('all-rates', rates);
      allRates = rates;
    }

    for (const coinId of coinIds) {
      rates[coinId] = allRates[coinId][currency];
    }

    return rates;
  }
}
