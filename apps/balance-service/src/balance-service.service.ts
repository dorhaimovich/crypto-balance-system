import { Injectable } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { BalanceInfo, Currency } from '@app/shared';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { BalancesRepository } from '@app/shared/database/repositories/balances.repository';
import { InsufficientBalanceException } from '@app/shared/exceptions/http.exceptions';
import { RatesRepository } from '@app/shared/database/repositories/rates.repository';
import { RebalanceDto } from './dto/rebalance.dto';

@Injectable()
export class BalanceService {
  constructor(
    private readonly ratesRepository: RatesRepository,
    private readonly balancesRepository: BalancesRepository,
  ) {}

  async getAllBalances(id: string): Promise<BalanceInfo[]> {
    return await this.balancesRepository.getAllBalances(id);
  }

  async getOneBalance(id: string, coin: string): Promise<BalanceInfo> {
    return await this.balancesRepository.getOneBalance(id, coin);
  }

  async createBalance(
    id: string,
    createBalanceDto: CreateBalanceDto,
  ): Promise<CreateBalanceDto> {
    return await this.balancesRepository.createBalance(id, createBalanceDto);
  }

  async changeBalance(
    id: string,
    coin: string,
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<BalanceInfo> {
    if (updateBalanceDto.amount < 0) {
      const balance = await this.balancesRepository.getOneBalance(id, coin);

      if (balance.amount < -updateBalanceDto.amount) {
        throw new InsufficientBalanceException(coin);
      }
    }

    return await this.balancesRepository.changeBalance(
      id,
      coin,
      updateBalanceDto,
    );
  }

  async deleteBalance(id: string, coin: string): Promise<BalanceInfo> {
    return await this.balancesRepository.deleteBalance(id, coin);
  }

  async getTotalBalances(
    id: string,
    currency: string,
  ): Promise<Record<Currency, number>> {
    const balances = await this.balancesRepository.getAllBalances(id);

    const rates = await this.ratesRepository.getRatesByCurrencyAndCoins(
      currency,
      balances.map((balance) => balance.coin),
    );

    const total = balances.reduce((sum, balance) => {
      return sum + rates[balance.coin] * balance.amount;
    }, 0);

    return { [currency]: total };
  }

  async rebalance(
    id: string,
    rebalanceDto: RebalanceDto,
  ): Promise<BalanceInfo[]> {
    const balances = await this.balancesRepository.getAllBalances(id);

    const rates = await this.ratesRepository.getRatesByCurrencyAndCoins(
      'usd',
      balances.map((balance) => balance.coin),
    );

    const total = balances.reduce((sum, balance) => {
      return sum + rates[balance.coin] * balance.amount;
    }, 0);

    for (const balance of balances) {
      const rebalanceItem = rebalanceDto.coins.find(
        (item) => item.coin === balance.coin,
      );

      balance.amount =
        (total * (rebalanceItem ? rebalanceItem.percentage : 0)) /
        100 /
        rates[balance.coin];
    }
    return await this.balancesRepository.setBalances(id, balances);
  }
}
