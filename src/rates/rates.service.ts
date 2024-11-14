import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RatesService {
  constructor(
    private readonly DatabaseService: DatabaseService,
    private configService: ConfigService,
  ) {
    // this.updateRates();
  }

  //   @Cron('*/5 * * * *') // Run every 5 minutes
  async updateRates() {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd',
      {
        headers: {
          'x-cg-demo-api-key':
            this.configService.get<string>('COINGECKO_API_KEY'),
          'Content-Type': 'application/json',
        },
      },
    );
    // console.log(response);
    console.log(JSON.stringify(response.data));
    return response.data;
  }
}
