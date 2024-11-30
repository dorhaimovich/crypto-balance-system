import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { RebalanceDto } from '../dto/rebalance.dto';

@ValidatorConstraint({ name: 'sumEquals100', async: false })
export class CompletePercentagesValidator
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const object = args.object as RebalanceDto;
    const sum = object.coins.reduce((acc, item) => acc + item.precentage, 0);
    return sum === 100;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'The sum of all percentages must equal 100.';
  }
}
