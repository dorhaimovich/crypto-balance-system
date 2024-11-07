type Balance = {
  currency: string;
  asset: string;
  amount: number;
};

type User = {
  id: string;
  name: string;
  balances: Balance[];
};

export { Balance, User };
