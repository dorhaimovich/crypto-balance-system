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
import { Balance, BalancesService } from './balances.service';
import { NoUserIdException } from 'src/shared/exceptions/http-exceptions';
import { CreateBalanceDto, UpdateBalanceDto } from './dto/balance.dto';

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
    return this.balancesService.createAsset(
      headers['x-user-id'],
      createBalanceDto,
    );
  }

  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateAsset(
    @Headers() headers: object,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    return updateBalanceDto; //TODO: create the update methods
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
