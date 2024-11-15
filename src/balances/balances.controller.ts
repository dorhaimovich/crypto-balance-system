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
import { NoUserIdException } from 'src/shared/exceptions/http-exceptions';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { LoggerService } from 'src/logger/logger.service';

// fix this
type Asset = string;
type Currency = string;
export type BalanceIdentifier = Asset | Currency;

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}
  private readonly logger = new LoggerService(BalancesController.name);

  @Get()
  getAllBalances(@Ip() ip: string, @Headers() headers: object) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for all balances from ip '${ip}'`,
      `${BalancesController.name}.${this.getAllBalances.name}`,
    );

    return this.balancesService.getAllBalances(headers['x-user-id']);
  }

  @Get(':asset')
  getOneBalance(
    @Ip() ip: string,
    @Headers() headers: object,
    @Param('asset') asset: string,
  ) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for all balances from ip '${ip}'`,
      `${BalancesController.name}.${this.getOneBalance.name}`,
    );

    return this.balancesService.getOneBalance(headers['x-user-id'], asset);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createBalance(
    @Ip() ip: string,
    @Headers() headers: object, // change type
    @Body() createBalanceDto: CreateBalanceDto,
  ) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for all balances from ip '${ip}'`,
      `${BalancesController.name}.${this.createBalance.name}`,
    );

    return this.balancesService.createBalance(
      headers['x-user-id'],
      createBalanceDto,
    );
  }

  @Patch(':identifier/add')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  addBalanceToAsset(
    @Ip() ip: string,
    @Headers() headers: object,
    @Param('identifier') identifier: BalanceIdentifier,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for all balances from ip '${ip}'`,
      `${BalancesController.name}.${this.addBalanceToAsset.name}`,
    );

    return this.balancesService.addBalance(
      headers['x-user-id'],
      identifier,
      updateBalanceDto,
    );
  }

  @Patch(':identifier/substract')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  substractBalanceFromAsset(
    @Ip() ip: string,
    @Headers() headers: object,
    @Param('identifier') identifier: BalanceIdentifier,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for all balances from ip '${ip}'`,
      `${BalancesController.name}.${this.substractBalanceFromAsset.name}`,
    );

    return this.balancesService.substractBalance(
      headers['x-user-id'],
      identifier,
      updateBalanceDto,
    );
  }

  @Patch(':identifier/set')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  setBalanceToAsset(
    @Ip() ip: string,
    @Headers() headers: object,
    @Param('identifier') identifier: BalanceIdentifier,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for all balances from ip '${ip}'`,
      `${BalancesController.name}.${this.setBalanceToAsset.name}`,
    );

    return this.balancesService.setBalance(
      headers['x-user-id'],
      identifier,
      updateBalanceDto,
    );
  }

  @Delete(':asset')
  deleteBalance(
    @Ip() ip: string,
    @Headers() headers: object,
    @Param('asset') asset: string,
  ) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for all balances from ip '${ip}'`,
      `${BalancesController.name}.${this.deleteBalance.name}`,
    );

    return this.balancesService.deleteBalance(headers['x-user-id'], asset);
  }
}
