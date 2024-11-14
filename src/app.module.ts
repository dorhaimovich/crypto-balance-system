import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalancesModule } from './balances/balances.module';
import { DatabaseModule } from './database/database.module';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [BalancesModule, DatabaseModule, RatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
