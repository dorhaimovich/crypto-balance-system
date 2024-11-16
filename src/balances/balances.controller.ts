import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Headers,
  ValidationPipe,
  UsePipes,
  Delete,
  Ip,
} from '@nestjs/common';
import { BalancesService } from './balances.service';
import { SymbolCoinMismatchException } from 'src/shared/exceptions/http.exceptions';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { LoggerService } from 'src/logger/logger.service';
import { BalacesApiHeader, BalanceInfo } from 'src/shared/interfaces';
import { Coin } from 'src/shared/types';
import { Constants as c } from 'src/shared/constants';
import { RequireUserId } from './guards/user-id.guard';
import { logRequest } from 'src/shared/utils';

@Controller('balances')
@RequireUserId()
export class BalancesController {
  private readonly logger = new LoggerService(BalancesController.name);

  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  getAllBalances(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
  ): Promise<BalanceInfo[]> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.getAllBalances.name,
      BalancesController.name,
    );

    return this.balancesService.getAllBalances(headers['x-user-id']);
  }

  @Get(':coin')
  getOneBalance(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Param('coin') coin: Coin,
  ): Promise<BalanceInfo> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.getOneBalance.name,
      BalancesController.name,
    );

    return this.balancesService.getOneBalance(headers['x-user-id'], coin);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createBalance(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Body() createBalanceDto: CreateBalanceDto,
  ) {
    logRequest(
      headers['x-user-id'],
      ip,
      this.createBalance.name,
      BalancesController.name,
    );

    if (c.COINS_SYMBOL_MAP[createBalanceDto.coin] !== createBalanceDto.symbol) {
      this.logger.error(
        'The symbol does not match the expected symbol for the coin',
        this.createBalance.name,
      );
      throw new SymbolCoinMismatchException(
        createBalanceDto.coin,
        createBalanceDto.symbol,
      );
    }

    return this.balancesService.createBalance(
      headers['x-user-id'],
      createBalanceDto,
    );
  }

  @Get('currency/:currency')
  getTotalBalances(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Param('currency') currency: string,
  ) {
    logRequest(
      headers['x-user-id'],
      ip,
      this.getTotalBalances.name,
      BalancesController.name,
    );

    return this.balancesService.getTotalBalances(
      headers['x-user-id'],
      currency,
    );
  }

  @Patch('/rebalance')
  rebalance(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Body() coins_precentages: Record<Coin, number>,
  ) {
    logRequest(
      headers['x-user-id'],
      ip,
      this.rebalance.name,
      BalancesController.name,
    );

    return this.balancesService.rebalance(
      headers['x-user-id'],
      coins_precentages,
    );
  }

  @Patch(':coin/add')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  addBalanceToCoin(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Param('coin') coin: Coin,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    logRequest(
      headers['x-user-id'],
      ip,
      this.addBalanceToCoin.name,
      BalancesController.name,
    );

    return this.balancesService.addBalance(
      headers['x-user-id'],
      coin,
      updateBalanceDto,
    );
  }

  @Patch(':coin/substract')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  substractBalanceFromCoin(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Param('coin') coin: Coin,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    logRequest(
      headers['x-user-id'],
      ip,
      this.substractBalanceFromCoin.name,
      BalancesController.name,
    );

    return this.balancesService.substractBalance(
      headers['x-user-id'],
      coin,
      updateBalanceDto,
    );
  }

  @Patch(':coin/set')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  setBalanceToCoin(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Param('coin') coin: Coin,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    logRequest(
      headers['x-user-id'],
      ip,
      this.setBalanceToCoin.name,
      BalancesController.name,
    );

    return this.balancesService.setBalance(
      headers['x-user-id'],
      coin,
      updateBalanceDto,
    );
  }

  @Delete(':coin')
  deleteBalance(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Param('coin') coin: Coin,
  ) {
    logRequest(
      headers['x-user-id'],
      ip,
      this.deleteBalance.name,
      BalancesController.name,
    );

    return this.balancesService.deleteBalance(headers['x-user-id'], coin);
  }
}
