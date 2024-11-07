import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalancesModule } from './balances/balances.module';

@Module({
  imports: [BalancesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
