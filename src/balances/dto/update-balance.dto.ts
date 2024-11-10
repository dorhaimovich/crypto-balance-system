import { IsNotEmpty, Min } from 'class-validator';

export class UpdateBalanceDto {
  @Min(0)
  @IsNotEmpty()
  amount: number;
}
