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
import { BalanceInfo, UserId } from '@app/shared';
import { CoinParam } from './params/coin.param';
import { RebalanceDto } from './dto/rebalance.dto';
import { LoggerService } from '@app/shared/logger/logger.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller('balances')
export class BalanceServiceController {
  constructor(
    private readonly balanceServiceService: BalanceServiceService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  getAllBalances(
    @Ip() ip: string,
    @UserId() userId: string,
  ): Promise<BalanceInfo[]> {
    logRequest(
      this.loggerService,
      userId,
      ip,
      formatName(BalanceServiceController.name, this.getAllBalances.name),
    );

    return this.balanceServiceService.getAllBalances(userId);
  }

  @Get(':coin')
  @UsePipes(new ValidationPipe())
  getOneBalance(
    @Ip() ip: string,
    @UserId() userId: string,
    @Param() { coin }: CoinParam,
  ): Promise<BalanceInfo> {
    logRequest(
      this.loggerService,
      userId,
      ip,
      formatName(BalanceServiceController.name, this.getOneBalance.name),
    );
    console.log(coin);
    return this.balanceServiceService.getOneBalance(userId, coin);
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  createBalance(
    @Ip() ip: string,
    @UserId() userId: string,
    @Body() createBalanceDto: CreateBalanceDto,
  ): Promise<CreateBalanceDto> {
    logRequest(
      this.loggerService,
      userId,
      ip,
      formatName(BalanceServiceController.name, this.createBalance.name),
    );
    return this.balanceServiceService.createBalance(userId, createBalanceDto);
  }

  // @Get('currency/:currency')
  // getTotalBalances(
  //   @Ip() ip: string,
  //   @Headers() headers: BalacesApiHeader,
  //   @Param('currency', new ZodValidationPipe(generateCurrencyEnum()))
  //   currency: string,
  // ): Promise<Record<string, number>> {
  //   logRequest(
  //     userId,
  //     ip,
  //     this.getTotalBalances.name,
  //     BalanceServiceController.name,
  //   );

  //   return this.balanceServiceService.getTotalBalances(
  //     userId,
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
    @UserId() userId: string,
    @Body() rebalanceDto: RebalanceDto,
  ): Promise<BalanceInfo[]> {
    logRequest(
      this.loggerService,
      userId,
      ip,
      formatName(BalanceServiceController.name, this.rebalance.name),
    );

    return this.balanceServiceService.rebalance(userId, rebalanceDto);
  }

  @Post(':coin')
  @UsePipes(new ValidationPipe())
  addBalance(
    @Ip() ip: string,
    @UserId() userId: string,
    @Param() { coin }: CoinParam,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<BalanceInfo> {
    logRequest(
      this.loggerService,
      userId,
      ip,
      formatName(BalanceServiceController.name, this.addBalance.name),
    );

    return this.balanceServiceService.addBalance(
      userId,
      coin,
      updateBalanceDto,
    );
  }

  @Delete(':coin')
  subtractBalance(
    @Ip() ip: string,
    @UserId() userId: string,
    @Param() { coin }: CoinParam,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<BalanceInfo> {
    logRequest(
      this.loggerService,
      userId,
      ip,
      formatName(BalanceServiceController.name, this.subtractBalance.name),
    );

    return this.balanceServiceService.substractBalance(
      userId,
      coin,
      updateBalanceDto,
    );
  }

  @Delete(':coin')
  @UsePipes(new ValidationPipe())
  deleteBalance(
    @Ip() ip: string,
    @UserId() userId: string,
    @Param() { coin }: CoinParam,
  ): Promise<BalanceInfo> {
    logRequest(
      this.loggerService,
      userId,
      ip,
      formatName(BalanceServiceController.name, this.deleteBalance.name),
    );

    return this.balanceServiceService.deleteBalance(userId, coin);
  }
}
