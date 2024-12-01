import { Module } from '@nestjs/common';
import { BalanceController } from './balance-service.controller';
import { BalanceService } from './balance-service.service';
import { SharedModule } from '@app/shared';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Throttlers } from '@app/shared/throttlers';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    SharedModule,
    ThrottlerModule.forRoot(Throttlers.getAllThrottlers()),
  ],
  controllers: [BalanceController],
  providers: [
    BalanceService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class BalanceServiceModule {}
