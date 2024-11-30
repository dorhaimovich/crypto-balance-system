import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Headers,
  UsePipes,
  Delete,
  Ip,
  ValidationPipe,
} from '@nestjs/common';

import { BalanceServiceService } from './balance-service.service';
import { CreateBalanceDto } from './dto/create-balance.dto';

import { formatName, logRequest } from '@app/shared/utils';
import { ApiHeader, BalanceInfo, RequireUserId } from '@app/shared';
import { CoinParam } from './params/coin.param';
import { RebalanceDto } from './dto/rebalance.dto';
import { LoggerService } from '@app/shared/logger/logger.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller('balances')
@RequireUserId()
export class BalanceServiceController {
  constructor(
    private readonly balanceServiceService: BalanceServiceService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  getAllBalances(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
  ): Promise<BalanceInfo[]> {
    logRequest(
      this.loggerService,
      headers['x-user-id'],
      ip,
      formatName(BalanceServiceController.name, this.getAllBalances.name),
    );

    return this.balanceServiceService.getAllBalances(headers['x-user-id']);
  }

  @Get(':coin')
  @UsePipes(new ValidationPipe())
  getOneBalance(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Param() { coin }: CoinParam,
  ): Promise<BalanceInfo> {
    logRequest(
      this.loggerService,
      headers['x-user-id'],
      ip,
      formatName(BalanceServiceController.name, this.getOneBalance.name),
    );
    console.log(coin);
    return this.balanceServiceService.getOneBalance(headers['x-user-id'], coin);
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  createBalance(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Body() createBalanceDto: CreateBalanceDto,
  ): Promise<CreateBalanceDto> {
    logRequest(
      this.loggerService,
      headers['x-user-id'],
      ip,
      formatName(BalanceServiceController.name, this.createBalance.name),
    );
    return this.balanceServiceService.createBalance(
      headers['x-user-id'],
      createBalanceDto,
    );
  }

  // @Get('currency/:currency')
  // getTotalBalances(
  //   @Ip() ip: string,
  //   @Headers() headers: BalacesApiHeader,
  //   @Param('currency', new ZodValidationPipe(generateCurrencyEnum()))
  //   currency: string,
  // ): Promise<Record<string, number>> {
  //   logRequest(
  //     headers['x-user-id'],
  //     ip,
  //     this.getTotalBalances.name,
  //     BalanceServiceController.name,
  //   );

  //   return this.balanceServiceService.getTotalBalances(
  //     headers['x-user-id'],
  //     currency,
  //   );
  // }

  @Patch('/rebalance')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  rebalance(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Body() coins_precentages: RebalanceDto,
  ): Promise<BalanceInfo[]> {
    logRequest(
      this.loggerService,
      headers['x-user-id'],
      ip,
      formatName(BalanceServiceController.name, this.rebalance.name),
    );

    return this.balanceServiceService.rebalance(
      headers['x-user-id'],
      coins_precentages,
    );
  }

  @Post(':coin')
  @UsePipes(new ValidationPipe())
  addBalance(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Param() { coin }: CoinParam,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<BalanceInfo> {
    logRequest(
      this.loggerService,
      headers['x-user-id'],
      ip,
      formatName(BalanceServiceController.name, this.addBalance.name),
    );

    return this.balanceServiceService.addBalance(
      headers['x-user-id'],
      coin,
      updateBalanceDto,
    );
  }

  @Delete(':coin')
  subtractBalance(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Param() { coin }: CoinParam,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<BalanceInfo> {
    logRequest(
      this.loggerService,
      headers['x-user-id'],
      ip,
      formatName(BalanceServiceController.name, this.subtractBalance.name),
    );

    return this.balanceServiceService.substractBalance(
      headers['x-user-id'],
      coin,
      updateBalanceDto,
    );
  }

  @Delete(':coin')
  @UsePipes(new ValidationPipe())
  deleteBalance(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Param() { coin }: CoinParam,
  ): Promise<BalanceInfo> {
    logRequest(
      this.loggerService,
      headers['x-user-id'],
      ip,
      formatName(BalanceServiceController.name, this.deleteBalance.name),
    );

    return this.balanceServiceService.deleteBalance(headers['x-user-id'], coin);
  }
}
