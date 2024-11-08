import { PartialType } from '@nestjs/mapped-types';

export class CreateBalanceDto {
  currency: string;
  asset: string;
  amount: number;
}

export class UpdateBalanceDto extends PartialType(CreateBalanceDto) {}
