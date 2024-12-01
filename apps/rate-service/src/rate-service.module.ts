import { Module } from '@nestjs/common';
import { RateServiceService } from './rate-service.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SharedModule } from '@app/shared';
import { ScheduleModule } from '@nestjs/schedule';

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
