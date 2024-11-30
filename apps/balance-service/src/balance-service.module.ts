import { Module } from '@nestjs/common';
import { BalanceServiceController } from './balance-service.controller';
import { BalanceServiceService } from './balance-service.service';
import { SharedModule } from '@app/shared';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Throttlers } from '@app/shared/throttlers';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    SharedModule,
    ThrottlerModule.forRoot(Throttlers.getAllThrottlers()),
  ],
  controllers: [BalanceServiceController],
  providers: [
    BalanceServiceService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class BalanceServiceModule {}
