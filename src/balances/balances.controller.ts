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
} from '@nestjs/common';
import { BalancesService } from './balances.service';
import {
  UpdateBalanceDto,
  updateBalanceSchema,
} from './schema/update-balance.schema';
import { LoggerService } from 'src/logger/logger.service';
import { BalacesApiHeader, BalanceInfo } from 'src/shared/interfaces';
import { Coin, CoinSchema } from 'src/shared/schemas/coin.schema';
import { RequireUserId } from './guards/user-id.guard';
import { logRequest } from 'src/shared/utils';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import {
  CreateBalanceDto,
  createBalanceSchema,
} from './schema/create-balance.schema';
import {
  CoinsPercentagesDto,
  coinsPercentagesSchema,
} from './schema/rebalance.schema';
import { generateCurrencyEnum } from 'src/shared/schemas/currency.schema';

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
    @Param('coin', new ZodValidationPipe(CoinSchema)) coin: Coin,
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
  @UsePipes(new ZodValidationPipe(createBalanceSchema))
  createBalance(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Body() createBalanceDto: CreateBalanceDto,
  ): Promise<CreateBalanceDto> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.createBalance.name,
      BalancesController.name,
    );

    return this.balancesService.createBalance(
      headers['x-user-id'],
      createBalanceDto,
    );
  }

  @Get('currency/:currency')
  getTotalBalances(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Param('currency', new ZodValidationPipe(generateCurrencyEnum()))
    currency: string,
  ): Promise<Record<string, number>> {
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
  @UsePipes(new ZodValidationPipe(coinsPercentagesSchema))
  rebalance(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Body() coins_precentages: CoinsPercentagesDto,
  ): Promise<BalanceInfo[]> {
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
  addBalanceToCoin(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Param('coin', new ZodValidationPipe(CoinSchema)) coin: Coin,
    @Body(new ZodValidationPipe(updateBalanceSchema))
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<number> {
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
  substractBalanceFromCoin(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Param('coin', new ZodValidationPipe(CoinSchema)) coin: Coin,
    @Body(new ZodValidationPipe(updateBalanceSchema))
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<number> {
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
  setBalanceToCoin(
    @Ip() ip: string,
    @Headers() headers: BalacesApiHeader,
    @Param('coin', new ZodValidationPipe(CoinSchema)) coin: Coin,
    @Body(new ZodValidationPipe(updateBalanceSchema))
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<number> {
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
    @Param('coin', new ZodValidationPipe(CoinSchema)) coin: Coin,
  ): Promise<BalanceInfo> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.deleteBalance.name,
      BalancesController.name,
    );

    return this.balancesService.deleteBalance(headers['x-user-id'], coin);
  }
}
