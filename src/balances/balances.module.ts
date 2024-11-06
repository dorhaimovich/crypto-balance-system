import { Module } from '@nestjs/common';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';

@Module({
  imports: [],
  controllers: [BalancesController],
  providers: [BalancesService],
})
export class BalancesModule {}
