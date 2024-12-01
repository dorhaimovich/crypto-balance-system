import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { firstValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';

import { DatabaseService } from '@app/shared/database/database.service';
import { LoggerService } from '@app/shared/logger/logger.service';
import { DataBaseFiles } from '@app/shared/db-files';
import { Coin, CoinInfo } from '@app/shared';
import { Currency } from '@app/shared/types/currency.type';
import { formatName } from '@app/shared/utils';

@Injectable()
export class RateServiceService {
  private readonly baseURl: string;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly loggerService: LoggerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.baseURl = this.configService.get<string>('COINGECKO_API_URL');
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

      this.databaseService.setData<string[]>(
        DataBaseFiles.VS_CURRENCIES,
        '/currencies',
        data,
      );

      this.loggerService.log(
        `${data.length} Currencies updated successfully`,
        formatName(
          RateServiceService.name,
          this.updateSupportedCurrencies.name,
        ),
      );
    } catch (error) {
      this.loggerService.error(
        error.response.data,
        formatName(
          RateServiceService.name,
          this.updateSupportedCurrencies.name,
        ),
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  private async updateRates(): Promise<void> {
    const endpoint = `${this.baseURl}simple/price`;

    const coins = await this.databaseService.getData<CoinInfo[]>(
      DataBaseFiles.COINS,
      '/coins',
    );
    const currs = await this.databaseService.getData<Currency[]>(
      DataBaseFiles.VS_CURRENCIES,
      '/currencies',
    );

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Record<Coin, Record<Currency, number>>>(endpoint, {
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

      this.databaseService.setData<Record<Coin, Record<Currency, number>>>(
        DataBaseFiles.RATES,
        'rates',
        data,
      );

      this.loggerService.log(
        `${Object.keys(data).length} Coins updated successfully`,
        formatName(RateServiceService.name, this.updateRates.name),
      );
    } catch (error) {
      this.loggerService.error(
        error.response.data,
        formatName(RateServiceService.name, this.updateRates.name),
      );
    }
  }
}
