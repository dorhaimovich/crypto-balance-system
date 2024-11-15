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
  private readonly logger = new LoggerService(BalancesController.name);

  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  getAllBalances(@Ip() ip: string, @Headers() headers: object) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for all balances from ip '${ip}'`,
      this.getAllBalances.name,
    );

    return this.balancesService.getAllBalances(headers['x-user-id']);
  }

  @Get(':coin')
  getOneBalance(
    @Ip() ip: string,
    @Headers() headers: object,
    @Param('coin') coin: string,
  ) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for all balances from ip '${ip}'`,
      this.getOneBalance.name,
    );

    return this.balancesService.getOneBalance(headers['x-user-id'], coin);
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
      this.createBalance.name,
    );

    return this.balancesService.createBalance(
      headers['x-user-id'],
      createBalanceDto,
    );
  }

  @Get('currency/:currency')
  getTotalBalances(
    @Ip() ip: string,
    @Headers() headers: object,
    @Param('currency') currency: string,
  ) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for total balances in '${currency}' from ip '${ip}'`,
      this.getTotalBalances.name,
    );

    return this.balancesService.getTotalBalances(
      headers['x-user-id'],
      currency,
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
      this.addBalanceToAsset.name,
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
      this.substractBalanceFromAsset.name,
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
      this.setBalanceToAsset.name,
    );

    return this.balancesService.setBalance(
      headers['x-user-id'],
      identifier,
      updateBalanceDto,
    );
  }

  @Delete(':coin')
  deleteBalance(
    @Ip() ip: string,
    @Headers() headers: object,
    @Param('coin') coin: string,
  ) {
    if (!headers['x-user-id']) {
      throw new NoUserIdException();
    }

    this.logger.log(
      `User '${headers['x-user-id']}' Requesed for all balances from ip '${ip}'`,
      this.deleteBalance.name,
    );

    return this.balancesService.deleteBalance(headers['x-user-id'], coin);
  }
}
