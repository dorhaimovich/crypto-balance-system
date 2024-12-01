import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { RebalanceDto } from '../dto/rebalance.dto';

@ValidatorConstraint({ name: 'uniqueCoins', async: false })
export class UniqueCoinsValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as RebalanceDto;
    const coins = object.coins.map((item) => item.coin);

    // Check if there are any duplicate coins
    const uniqueCoins = new Set(coins);
    return coins.length === uniqueCoins.size;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'All coins must be unique.';
  }
}
