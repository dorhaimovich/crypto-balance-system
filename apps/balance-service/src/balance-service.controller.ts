import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  Delete,
  Ip,
  ValidationPipe,
  Put,
} from '@nestjs/common';

import { BalanceService } from './balance-service.service';
import { CreateBalanceDto } from './dto/create-balance.dto';

import { formatName, logRequest } from '@app/shared/utils';
import { BalanceInfo, UserId } from '@app/shared';
import { CoinParam } from './params/coin.param';
import { LoggerService } from '@app/shared/logger/logger.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { CurrencyParam } from './params/currency.param';
import { RebalanceDto } from './dto/rebalance.dto';

@Controller('balances')
export class BalanceController {
  constructor(
    private readonly balanceService: BalanceService,
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
      formatName(BalanceController.name, this.getAllBalances.name),
    );

    return this.balanceService.getAllBalances(userId);
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
      formatName(BalanceController.name, this.getOneBalance.name),
    );
    console.log(coin);
    return this.balanceService.getOneBalance(userId, coin);
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
      formatName(BalanceController.name, this.createBalance.name),
    );
    return this.balanceService.createBalance(userId, createBalanceDto);
  }

  @Patch(':coin')
  @UsePipes(new ValidationPipe())
  chagneBalance(
    @Ip() ip: string,
    @UserId() userId: string,
    @Param() { coin }: CoinParam,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<BalanceInfo> {
    logRequest(
      this.loggerService,
      userId,
      ip,
      formatName(BalanceController.name, this.chagneBalance.name),
    );

    return this.balanceService.changeBalance(userId, coin, updateBalanceDto);
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
      formatName(BalanceController.name, this.deleteBalance.name),
    );

    return this.balanceService.deleteBalance(userId, coin);
  }

  @Get('currency/:currency')
  @UsePipes(new ValidationPipe())
  getTotalBalances(
    @Ip() ip: string,
    @UserId() userId: string,
    @Param() { currency }: CurrencyParam,
  ): Promise<Record<string, number>> {
    logRequest(
      this.loggerService,
      userId,
      ip,
      formatName(BalanceController.name, this.getTotalBalances.name),
    );

    return this.balanceService.getTotalBalances(userId, currency);
  }

  @Put('/rebalance')
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
      formatName(BalanceController.name, this.rebalance.name),
    );
    return this.balanceService.rebalance(userId, rebalanceDto);
  }
}
