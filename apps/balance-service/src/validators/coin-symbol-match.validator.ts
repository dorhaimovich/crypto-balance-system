import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Constants as c } from '@app/shared';

@ValidatorConstraint({ name: 'coinSymbolMatch', async: false })
export class CoinSymbolMatchValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    return c.COINS_SYMBOL_MAP[object.coin] === object.symbol;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'The symbol does not match the coin';
  }
}
