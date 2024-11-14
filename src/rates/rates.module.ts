import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
