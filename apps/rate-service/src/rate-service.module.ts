import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

import { RateServiceService } from './rate-service.service';

import { SharedModule } from '@app/shared';

@Module({
  imports: [
    SharedModule,
    HttpModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  providers: [RateServiceService],
})
export class RateServiceModule {}
