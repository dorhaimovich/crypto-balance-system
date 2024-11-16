export type Coin =
  | 'tether'
  | 'ethereum'
  | 'bitcoin'
  | 'binancecoin'
  | 'usd-coin'
  | 'ripple'
  | 'cardano'
  | 'binance-usd'
  | 'solana'
  | 'polkadot';

export type ExceptionsResponseObject = {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  response: string | object;
};
