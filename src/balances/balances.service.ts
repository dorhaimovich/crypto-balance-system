import { Injectable } from '@nestjs/common';
import { User } from 'src/shared/types';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { DatabaseService } from './../database/database.service';
import { BalanceIdentifier } from './balances.controller';
@Injectable()
export class BalancesService {
  private balances: User[] = [
    {
      id: '123',
      name: 'Jonny',
      balances: [
        {
          currency: 'BTC',
          asset: 'bitcoin',
          amount: 700,
        },
        {
          currency: 'THC',
          asset: 'Tonny',
          amount: 200,
        },
      ],
    },
    {
      id: '12345',
      name: 'JonnyKamony',
      balances: [
        {
          currency: 'BTC',
          asset: 'bitcoin',
          amount: 1700,
        },
        {
          currency: 'THC',
          asset: 'Tonny',
          amount: 2300,
        },
      ],
    },
  ];

  constructor(private readonly DatabaseService: DatabaseService) {}

  async getAllBalances(id: string) {
    return this.DatabaseService.getAllUserBalances(id);
  }

  async getOneBalance(id: string, asset: string) {
    return this.DatabaseService.getOneUserBalance(id, asset);
  }

  async createBalance(id: string, createBalanceDto: CreateBalanceDto) {
    return this.DatabaseService.createUserBalance(id, createBalanceDto);
  }

  async updateBalance(
    id: string,
    identifier: BalanceIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.DatabaseService.updateUserBalance(
      id,
      identifier,
      updateBalanceDto,
    );
  }

  async deleteBalance(id: string, identifier: BalanceIdentifier) {
    return this.DatabaseService.deleteUserBalance(id, identifier);
  }
}
