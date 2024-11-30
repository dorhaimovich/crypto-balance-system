import { Module } from '@nestjs/common';
import { RateServiceController } from './rate-service.controller';
import { RateServiceService } from './rate-service.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SharedModule } from '@app/shared';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    SharedModule,
    HttpModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 0,
    }),
  ],
  controllers: [RateServiceController],
  providers: [RateServiceService],
})
export class RateServiceModule {}
