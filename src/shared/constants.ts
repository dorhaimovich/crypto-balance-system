const CoinsList = [
  'tether',
  'ethereum',
  'bitcoin',
  'binancecoin',
  'usd-coin',
  'ripple',
  'cardano',
  'binance-usd',
  'solana',
  'polkadot',
];

const CoinSymbolMap = {
  tether: 'usdt',
  ethereum: 'eth',
  bitcoin: 'btc',
  binancecoin: 'bnb',
  'usd-coin': 'usdc',
  ripple: 'xrp',
  cardano: 'ada',
  'binance-usd': 'busd',
  solana: 'sol',
  polkadot: 'dot',
};

export class Constants {
  static COINS_SYMBOL_MAP = CoinSymbolMap;
  static COINS_LIST = CoinsList;
}
