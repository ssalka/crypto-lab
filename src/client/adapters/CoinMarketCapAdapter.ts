import bind from 'bind-decorator';
import _ from 'lodash/fp';

import {
  CurrencyCode,
  ICoinMarketCapCoin,
  INormalizedCoinMarketCapCoin,
  Optional
} from 'src/client/interfaces';

export default class CoinMarketCapAdapter {
  constructor(public base: CurrencyCode = CurrencyCode.Dollar) {}

  requestedCoins: CurrencyCode[] = [];

  coins: Optional<INormalizedCoinMarketCapCoin>[] = [];

  allCoins: ICoinMarketCapCoin[] = [];

  setCoinList(coinNames: CurrencyCode[]) {
    this.requestedCoins = coinNames;
  }

  async getCoins(): Promise<Optional<INormalizedCoinMarketCapCoin>[]> {
    const response = await fetch('/cmc').then(_.invoke('json'));
    this.allCoins = _.values(response);
    this.coins = this.matchRequestedCoins(response);

    return this.coins;
  }

  matchRequestedCoins(allCoins: ICoinMarketCapCoin[]) {
    return this.requestedCoins
      .map(this.findByName)
      .map(coin => coin && this.normalizeSchema(coin));
  }

  @bind
  findByName(symbol: CurrencyCode): Optional<ICoinMarketCapCoin> {
    const primarySymbol = symbol
      .replace(/,.*$/g, '')
      .replace(CurrencyCode.IOTA, 'MIOTA');

    return _.find({ symbol: primarySymbol } as Partial<ICoinMarketCapCoin>, this.allCoins);
  }

  @bind
  normalizeSchema(coin: ICoinMarketCapCoin): INormalizedCoinMarketCapCoin {
    return {
      ..._.pick(['name', 'symbol', 'rank'], coin),
      marketCap: coin.quotes.USD.market_cap,
      price: coin.quotes.USD.price
    };
  }
}
