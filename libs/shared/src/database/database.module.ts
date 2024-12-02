import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { LoggerModule } from '../logger/logger.module';
import { BalancesRepository } from './repositories/balances.repository';
import { RatesRepository } from './repositories/rates.repository';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [DatabaseService, BalancesRepository, RatesRepository],
  exports: [DatabaseService, BalancesRepository, RatesRepository],
  imports: [
    LoggerModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 0,
    }),
  ],
})
export class DatabaseModule {}
