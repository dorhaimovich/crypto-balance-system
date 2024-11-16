import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from 'src/logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DataBaseFiles } from 'src/shared/db-files';
import { CoinInfo } from 'src/shared/interfaces';
import { Coin } from 'src/shared/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RatesService {
  private readonly logger = new LoggerService(RatesService.name);
  private readonly baseURl: string;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.baseURl = this.configService.get<string>('COINGECKO_API_URL');
  }

  async getRates(
    currency: string,
    coinIds: Coin[],
  ): Promise<Partial<Record<Coin, number>>> {
    const rates: Partial<Record<Coin, number>> = {};

    for (const coinId of coinIds) {
      try {
        const value = await this.cacheManager.get<number>(
          `${coinId}-${currency}`,
        );

        if (value) {
          console.log('value out from cache');
          rates[coinId] = value;
        } else {
          const rate = await this.databaseService.getData(
            DataBaseFiles.RATES,
            `/${coinId}/${currency.toLowerCase()}`,
          );

          rates[coinId] = rate;
          await this.cacheManager.set(`${coinId}-${currency}`, rate);
        }
      } catch (error) {
        this.logger.error(error, this.getRates.name);
      }
    }

    return rates;
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  private async updateSupportedCurrencies(): Promise<void> {
    const endpoint = `${this.baseURl}simple/supported_vs_currencies`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<string[]>(endpoint, {
          headers: {
            'x-cg-demo-api-key':
              this.configService.get<string>('COINGECKO_API_KEY'),
            'Content-Type': 'application/json',
          },
        }),
      );

      this.databaseService.setData(
        DataBaseFiles.VS_CURRENCIES,
        '/currencies',
        data,
      );
    } catch (error) {
      this.logger.error(
        error.response.data,
        this.updateSupportedCurrencies.name,
      );
    } finally {
      this.logger.log('Job Done', this.updateSupportedCurrencies.name);
    }
  }

  // clean that method
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  private async updateRates(): Promise<void> {
    const endpoint = `${this.baseURl}simple/price`;

    const coins: CoinInfo[] = await this.databaseService.getData(
      DataBaseFiles.COINS,
      '/coins',
    );
    const currs = await this.databaseService.getData(
      DataBaseFiles.VS_CURRENCIES,
      '/currencies',
    );

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Map<string, Map<string, number>>>(endpoint, {
          params: {
            ids: coins.map((x) => x.id).join(','),
            vs_currencies: currs.join(','),
          },
          headers: {
            'x-cg-demo-api-key':
              this.configService.get<string>('COINGECKO_API_KEY'),
            'Content-Type': 'application/json',
          },
        }),
      );

      this.cacheManager.reset();
      this.databaseService.setData(DataBaseFiles.RATES, 'rates', data);
    } catch (error) {
      this.logger.error(error.response.data, this.updateRates.name);
    } finally {
      this.logger.log('Job Done', this.updateRates.name);
    }
  }
}
