import { Constants as c } from '@app/shared/constants';
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

export class RebalanceDto {
  @ValidateNested()
  @Type(() => RebalanceItemDto)
  @Validate(CompletePercentagesValidator)
  coins: RebalanceItemDto[];
}

class RebalanceItemDto {
  @IsEnum(c.COINS_LIST)
  coin: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  precentage: number;
}
