import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from 'src/logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DataBaseFiles } from 'src/shared/constants/db-files.constants';
import { Coin } from 'src/shared/interfaces/coin.interface';
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
  async getSupportedCurrencies() {
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
      this.logger.error(err.response.data, this.getSupportedCurrencies.name);
    } finally {
      this.logger.log('Job Done', this.getSupportedCurrencies.name);
    }
  }

  // clean that method
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async getRates() {
    const endpoint = `${this.baseURl}simple/price`;

    const coins: Coin[] = await this.databaseService.getData(
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
      this.logger.error(err.response.data, this.getRates.name);
    } finally {
      this.logger.log('Job Done', this.getRates.name);
    }
  }
}
