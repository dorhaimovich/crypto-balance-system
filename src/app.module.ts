import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalancesModule } from './balances/balances.module';
import { DatabaseModule } from './database/database.module';
import { RatesModule } from './rates/rates.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BalancesModule,
    DatabaseModule,
    RatesModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
