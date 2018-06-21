import bind from 'bind-decorator';
import _ from 'lodash/fp';

import {
  CurrencyCode,
  ICoinMarketCapCoin,
  INormalizedCoinMarketCapCoin
} from 'src/client/interfaces';

export default class CoinMarketCapAdapter {
  constructor(public base: CurrencyCode = CurrencyCode.Dollar) {}

  requestedCoins: CurrencyCode[] = [];

  coins: INormalizedCoinMarketCapCoin[] = [];

  allCoins: ICoinMarketCapCoin[] = [];

  setCoinList(coinNames: CurrencyCode[]) {
    this.requestedCoins = coinNames;
  }

  async getCoins(): Promise<INormalizedCoinMarketCapCoin[]> {
    const response = await fetch('/cmc').then(_.invoke('json'));
    this.matchRequestedCoins(response);

    return this.coins;
  }

  matchRequestedCoins(allCoins: ICoinMarketCapCoin[]) {
    this.allCoins = _.values(allCoins);
    this.coins = this.requestedCoins
      .map(this.findByName)
      .map(this.normalizeSchema);
  }

  @bind
  findByName(symbol: CurrencyCode): ICoinMarketCapCoin {
    const primarySymbol = symbol
      .replace(/,.*$/g, '')
      .replace(CurrencyCode.IOTA, 'MIOTA');

    return _.find({ symbol: primarySymbol } as Partial<ICoinMarketCapCoin>, this.allCoins);
  }

  @bind
  normalizeSchema(coin: ICoinMarketCapCoin | null): INormalizedCoinMarketCapCoin {
    if (!coin) return null;

    return {
      ..._.pick(['name', 'symbol', 'rank'], coin),
      marketCap: coin.quotes.USD.market_cap,
      price: coin.quotes.USD.price
    };
  }
}
