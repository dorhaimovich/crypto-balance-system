import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [DatabaseModule, ConfigModule, HttpModule],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
