import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { Balance, BalancesService } from './balances.service';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  getAllBalances(@Headers() headers: object) {
    if (!headers['x-user-id']) {
      throw BadRequestException; // no id in headers
    }
    const balances = this.balancesService.getAllBalances(headers['x-user-id']);
    return balances;
  }

  @Get(':asset')
  getOneBalance(@Headers() headers: object, @Param('asset') asset: string) {
    if (!headers['x-user-id']) {
      throw BadRequestException; // no id in headers
    }
    if (!asset) {
      throw BadRequestException; // no asset sent
      //is in nesseary? with no asset it will get all...
    }
    const balance = this.balancesService.getOneBalance(
      headers['x-user-id'],
      asset,
    );

    return balance;
  }

  @Post()
  createAsset(@Headers() headers: object, @Body() asset: Balance) {
    const user = this.balancesService.createAsset(headers['x-user-id'], asset);
    return user;
  }

  @Patch(':asset')
  updateAsset(
    @Headers() headers: object,
    @Param('asset') asset: string,
    @Body() body: object,
  ) {
    return asset; //TODO: create the update methods
  }

  @Delete(':asset')
  removeAsset(@Headers() headers: object, @Param('asset') asset: string) {
    const removedBalance = this.balancesService.deleteBalance(
      headers['x-user-id'],
      asset,
    );
    return removedBalance;
  }
}
