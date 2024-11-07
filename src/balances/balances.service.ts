import { Injectable, BadRequestException } from '@nestjs/common';
import { Balance, User } from 'src/shared/interfaces';

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

  getAllBalances(id?: string) {
    if (!id) {
      throw BadRequestException;
    }

    const filterUser = this.balances.find((user) => user.id == id);
    if (!filterUser) {
      throw BadRequestException; // user not exist, maybe create one?
    }
    return filterUser.balances;
  }

  getOneBalance(id: string, asset: string) {
    if (!id || !asset) {
      throw BadRequestException;
    }

    const user = this.balances.find((user) => user.id == id);
    if (!user) {
      throw BadRequestException; // no user found
    }

    let balance = this.getOneBalanceByAsset(user, asset);
    if (!balance) {
      balance = this.getOneBalanceByCurrency(user, asset);
    }
    if (!balance) {
      throw BadRequestException; // balance not found
    }

    return balance;
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

  createAsset(id: string, newBalance: Balance) {
    const user = this.balances.find((user) => user.id == id);
    if (!user) {
      throw BadRequestException; // no user found
    }

    const balance = user.balances.find(
      (balance) => balance.currency == newBalance.currency,
    );
    if (balance) {
      throw BadRequestException; // currency already exist
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

