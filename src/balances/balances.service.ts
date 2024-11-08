import { Injectable, BadRequestException } from '@nestjs/common';
import {
  AssetAlreadyExistException,
  AssetNotFoundException,
  CurrencyAlreadyExistException,
  UserNotFoundException,
} from 'src/shared/exceptions/http-exceptions';
import { Balance, User } from 'src/shared/types';

@Injectable()
export class BalancesService {
  private balances: User[] = [
    {
      id: '123',
      name: 'Jonny',
      balances: [
        {
          currency: 'BTC',
          asset: 'bitcoin',
          amount: 700,
        },
        {
          currency: 'THC',
          asset: 'Tonny',
          amount: 200,
        },
      ],
    },
    {
      id: '12345',
      name: 'JonnyKamony',
      balances: [
        {
          currency: 'BTC',
          asset: 'bitcoin',
          amount: 1700,
        },
        {
          currency: 'THC',
          asset: 'Tonny',
          amount: 2300,
        },
      ],
    },
  ];
  private getUser(id: string) {
    const user = this.balances.find((user) => user.id == id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  private getOneBalanceByCurrency(user: User, currency: string) {
    return user.balances.find(
      (balance) => balance.currency.toLowerCase() == currency.toLowerCase(),
    );
  }
  private getOneBalanceByAsset(user: User, asset: string) {
    return user.balances.find(
      (balance) => balance.asset.toLowerCase() == asset.toLowerCase(),
    );
  }

  getAllBalances(id: string) {
    return this.getUser(id).balances;
  }

  getOneBalance(id: string, asset: string) {
    const user = this.getUser(id);

    let balance = this.getOneBalanceByAsset(user, asset);
    if (!balance) {
      balance = this.getOneBalanceByCurrency(user, asset);
    }
    if (!balance) {
      throw new AssetNotFoundException(asset);
    }

    return balance;
  }

  createAsset(id: string, newBalance: Balance) {
    const user = this.getUser(id);

    let balance = user.balances.find(
      (balance) => balance.asset == newBalance.asset,
    );
    if (balance) {
      throw new AssetAlreadyExistException(balance.asset);
    }

    balance = user.balances.find(
      (balance) => balance.currency == newBalance.currency,
    );
    if (balance) {
      throw new CurrencyAlreadyExistException(balance.currency);
    }

    user.balances.push(newBalance); // add asset to the user in db
    return user;
  }

  updateAsset(
    id: string,
    newBalance: {
      currency?: string;
      asset?: string;
      amount: number;
    },
  ) {
    const user = this.balances.find((user) => user.id == id);
    if (!user) {
      throw BadRequestException; // no user found
    }

    const balance = user.balances.find(
      (balance) => balance.currency == newBalance.currency,
    );
    if (!balance) {
      throw BadRequestException; // currency not exist
    }

    user.balances = user.balances.map((balance) => {
      if (balance.currency == newBalance.currency) {
        return { ...balance, ...newBalance };
      }
      return balance;
    });

    return user;
    // add currency to the user in db
  }

  deleteBalance(id: string, asset: string) {
    if (!id || !asset) {
      throw BadRequestException;
    }
    const user = this.balances.find((user) => user.id == id);
    if (!user) {
      throw BadRequestException; // no user found
    }

    const removedBalance = this.getOneBalance(id, asset);
    user.balances = user.balances.filter((balance) => balance.asset !== asset);

    return removedBalance;
  }
}
export { Balance };
