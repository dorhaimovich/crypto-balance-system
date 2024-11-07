import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class BalancesService {
  private balances = [
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
      asset: 'JonnyKamony',
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

  getOneBalance(id: string, currency: string) {
    if (!id || !currency) {
      throw BadRequestException;
    }
    const user = this.balances.find((user) => user.id == id);
    if (!user) {
      throw BadRequestException; // no user found
    }

    const balance = user.balances.find(
      (balance) => balance.currency == currency,
    );

    return balance;
  }

  createAsset(
    id: string,
    newBalance: { currency: string; asset: string; amount: Float32Array },
  ) {
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

    // add currency to the user in db
  }

  updateAsset(
    id: string,
    newBalance: {
      currency: string;
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

  deleteBalance(id: string, currency: string) {
    if (!id || !currency) {
      throw BadRequestException;
    }
    const user = this.balances.find((user) => user.id == id);
    if (!user) {
      throw BadRequestException; // no user found
    }

    const removedBalance = this.getOneBalance(id, currency);
    user.balances = user.balances.filter(
      (balance) => balance.currency !== currency,
    );

    return removedBalance;
  }
}
