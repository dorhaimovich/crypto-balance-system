import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BalancesModule } from './balances/balances.module';
import { DatabaseModule } from './database/database.module';
import { RatesModule } from './rates/rates.module';
import { LoggerModule } from './logger/logger.module';
import { Throttlers } from './shared/constants/throttlers.constants';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    BalancesModule,
    DatabaseModule,
    RatesModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot(Throttlers.getAllThrottlers()),
    ScheduleModule.forRoot(),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
