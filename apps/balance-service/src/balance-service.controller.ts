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

import {
  UpdateBalanceDto,
  updateBalanceSchema,
} from './schema/update-balance.schema';
import { BalanceServiceService } from './balance-service.service';
import {
  CreateBalanceDto,
  createBalanceSchema,
} from './schema/create-balance.schema';

import { logRequest } from '@app/shared/utils';
import { ZodValidationPipe } from '@app/shared/pipes/zod-validation.pipe';
import { Coin, CoinSchema } from '@app/shared/schemas/coin.schema';
import { ApiHeader, BalanceInfo, RequireUserId } from '@app/shared';

@Controller('balances')
@RequireUserId()
export class BalanceServiceController {
  constructor(private readonly balanceServiceService: BalanceServiceService) {}

  @Get()
  getAllBalances(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
  ): Promise<BalanceInfo[]> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.getAllBalances.name,
      BalanceServiceController.name,
    );

    return this.balanceServiceService.getAllBalances(headers['x-user-id']);
  }

  @Get(':coin')
  getOneBalance(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Param('coin', new ZodValidationPipe(CoinSchema)) coin: Coin,
  ): Promise<BalanceInfo> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.getOneBalance.name,
      BalanceServiceController.name,
    );

    return this.balanceServiceService.getOneBalance(headers['x-user-id'], coin);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createBalanceSchema))
  createBalance(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Body() createBalanceDto: CreateBalanceDto,
  ): Promise<CreateBalanceDto> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.createBalance.name,
      BalanceServiceController.name,
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

  // @Patch('/rebalance')
  // @UsePipes(new ZodValidationPipe(coinsPercentagesSchema))
  // rebalance(
  //   @Ip() ip: string,
  //   @Headers() headers: BalacesApiHeader,
  //   @Body() coins_precentages: CoinsPercentagesDto,
  // ): Promise<BalanceInfo[]> {
  //   logRequest(
  //     headers['x-user-id'],
  //     ip,
  //     this.rebalance.name,
  //     BalanceServiceController.name,
  //   );

  //   return this.balanceServiceService.rebalance(
  //     headers['x-user-id'],
  //     coins_precentages,
  //   );
  // }

  @Patch(':coin/add')
  addBalanceToCoin(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Param('coin', new ZodValidationPipe(CoinSchema)) coin: Coin,
    @Body(new ZodValidationPipe(updateBalanceSchema))
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<number> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.addBalanceToCoin.name,
      BalanceServiceController.name,
    );

    return this.balanceServiceService.addBalance(
      headers['x-user-id'],
      coin,
      updateBalanceDto,
    );
  }

  @Patch(':coin/substract')
  substractBalanceFromCoin(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Param('coin', new ZodValidationPipe(CoinSchema)) coin: Coin,
    @Body(new ZodValidationPipe(updateBalanceSchema))
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<number> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.substractBalanceFromCoin.name,
      BalanceServiceController.name,
    );

    return this.balanceServiceService.substractBalance(
      headers['x-user-id'],
      coin,
      updateBalanceDto,
    );
  }

  @Patch(':coin/set')
  setBalanceToCoin(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Param('coin', new ZodValidationPipe(CoinSchema)) coin: Coin,
    @Body(new ZodValidationPipe(updateBalanceSchema))
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<number> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.setBalanceToCoin.name,
      BalanceServiceController.name,
    );

    return this.balanceServiceService.setBalance(
      headers['x-user-id'],
      coin,
      updateBalanceDto,
    );
  }

  @Delete(':coin')
  deleteBalance(
    @Ip() ip: string,
    @Headers() headers: ApiHeader,
    @Param('coin', new ZodValidationPipe(CoinSchema)) coin: Coin,
  ): Promise<BalanceInfo> {
    logRequest(
      headers['x-user-id'],
      ip,
      this.deleteBalance.name,
      BalanceServiceController.name,
    );

    return this.balanceServiceService.deleteBalance(headers['x-user-id'], coin);
  }
}
