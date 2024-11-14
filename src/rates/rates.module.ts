import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
