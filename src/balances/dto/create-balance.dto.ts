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
