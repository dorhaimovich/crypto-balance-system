import { Module } from '@nestjs/common';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';
import { DatabaseModule } from 'src/database/database.module';
import { RatesModule } from 'src/rates/rates.module';

@Module({
  imports: [DatabaseModule, RatesModule],
  controllers: [BalancesController],
  providers: [BalancesService],
})
export class BalancesModule {}
