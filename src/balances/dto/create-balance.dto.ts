import {
  IsNotEmpty,
  IsString,
  IsUppercase,
  Length,
  Min,
} from 'class-validator';

export class CreateBalanceDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 4)
  @IsUppercase()
  currency: string;

  @IsString()
  @IsNotEmpty()
  coin: string;

  @Min(0)
  @IsNotEmpty()
  amount: number;
}
