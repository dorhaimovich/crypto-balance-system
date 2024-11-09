import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Headers,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { BalancesService } from './balances.service';
import { NoUserIdException } from 'src/shared/exceptions/http-exceptions';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

type Asset = string;
type Currency = string;
export type BalanceIdentifier = Asset | Currency;

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  getAllBalances(@Headers() headers: object) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }
    const balances = this.balancesService.getAllBalances(headers['x-user-id']);
    return balances;
  }

  @Get(':asset')
  getOneBalance(@Headers() headers: object, @Param('asset') asset: string) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    return this.balancesService.getOneBalance(headers['x-user-id'], asset);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createAsset(
    @Headers() headers: object,
    @Body() createBalanceDto: CreateBalanceDto,
  ) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    return this.balancesService.createBalance(
      headers['x-user-id'],
      createBalanceDto,
    );
  }

  @Patch(':identifier')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateAsset(
    @Headers() headers: object,
    @Param('identifier') identifier: BalanceIdentifier,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    return this.balancesService.updateBalance(
      headers['x-user-id'],
      identifier,
      updateBalanceDto,
    );
  }

  @Delete(':asset')
  removeAsset(@Headers() headers: object, @Param('asset') asset: string) {
    return this.balancesService.deleteBalance(headers['x-user-id'], asset);
  }
}
