import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateBalanceDto {
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
