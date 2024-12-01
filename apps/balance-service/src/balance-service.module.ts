import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { BalanceController } from './balance-service.controller';
import { BalanceService } from './balance-service.service';

import { SharedModule, Throttlers } from '@app/shared';

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
