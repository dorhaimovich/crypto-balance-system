import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from 'src/logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DataBaseFiles } from 'src/shared/db-files';
import { CoinInfo } from 'src/shared/interfaces';

@Injectable()
export class RatesService {
  private readonly logger = new LoggerService(RatesService.name);
  private readonly baseURl: string;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
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

      this.databaseService.setData(
        DataBaseFiles.VS_CURRENCIES,
        '/currencies',
        data,
      );
    } catch (err) {
      this.logger.error(err.response.data, this.updateSupportedCurrencies.name);
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

      this.databaseService.setData(DataBaseFiles.RATES, 'rates', data);
    } catch (err) {
      this.logger.error(err.response.data, this.updateRates.name);
    } finally {
      this.logger.log('Job Done', this.updateRates.name);
    }
  }
}
