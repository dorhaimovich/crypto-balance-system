import { Injectable } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { ChangeBalanceDto } from './dto/change-balance.dto';
import { DatabaseService } from './../database/database.service';
import { BalanceIdentifier } from './balances.controller';
import { UpdateBalanceDto } from './dto/update-balance.dto';
@Injectable()
export class BalancesService {
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

  async changeBalance(
    id: string,
    identifier: BalanceIdentifier,
    changeBalanceDto: ChangeBalanceDto,
  ) {
    return this.DatabaseService.changeUserBalance(
      id,
      identifier,
      changeBalanceDto,
    );
  }

  async addBalance(
    id: string,
    identifier: BalanceIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.DatabaseService.addUserBalance(
      id,
      identifier,
      updateBalanceDto,
    );
  }

  async substractBalance(
    id: string,
    identifier: BalanceIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.DatabaseService.substractUserBalance(
      id,
      identifier,
      updateBalanceDto,
    );
  }

  async setBalance(
    id: string,
    identifier: BalanceIdentifier,
    updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.DatabaseService.setUserBalance(
      id,
      identifier,
      updateBalanceDto,
    );
  }

  async deleteBalance(id: string, identifier: BalanceIdentifier) {
    return this.DatabaseService.deleteUserBalance(id, identifier);
  }
}
