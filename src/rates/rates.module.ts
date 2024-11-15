import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RatesController } from './rates.controller';
@Module({
  imports: [DatabaseModule, ConfigModule, HttpModule],
  providers: [RatesService],
  exports: [RatesService],
  controllers: [RatesController],
})
export class RatesModule {}
