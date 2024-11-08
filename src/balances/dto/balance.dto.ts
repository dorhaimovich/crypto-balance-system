import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBalanceDto {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  asset: string;

  @Min(0)
  @IsNotEmpty()
  amount: number;
}

export class UpdateBalanceDto extends PartialType(CreateBalanceDto) {}
