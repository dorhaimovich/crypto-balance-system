import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  Min,
  Max,
  Validate,
  ValidateNested,
} from 'class-validator';
import { CompletePercentagesValidator } from '../validators/complete-percentages.validator';
import { UniqueCoinsValidator } from '../validators/unique-coins.validator';
import { Constants as c } from '@app/shared';

export class RebalanceDto {
  @ValidateNested()
  @Type(() => RebalanceItemDto)
  @Validate(CompletePercentagesValidator)
  @Validate(UniqueCoinsValidator)
  coins: RebalanceItemDto[];
}

class RebalanceItemDto {
  @IsEnum(c.COINS_LIST)
  coin: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}
