import bind from 'bind-decorator';
import _ from 'lodash/fp';

import {
  CurrencyCode,
  CoinMarketCapCoin
} from 'src/client/interfaces';

export default class CoinMarketCapAdapter {
  constructor(public base: CurrencyCode = CurrencyCode.Dollar) {}

  requestedCoins: CurrencyCode[] = [];

  coins: CoinMarketCapCoin[] = [];

  allCoins: CoinMarketCapCoin[] = [];

  setCoinList(coinNames: CurrencyCode[]) {
    this.requestedCoins = coinNames;
  }

  async getCoins(): Promise<CoinMarketCapCoin[]> {
    this.cacheCoins(await fetch('/cmc').then(_.invoke('json')));

    return this.coins;
  }

  cacheCoins(allCoins: CoinMarketCapCoin[]) {
    this.allCoins = allCoins;
    this.coins = this.requestedCoins.map(this.findByName);
  }

  @bind
  findByName(symbol?: CurrencyCode): CoinMarketCapCoin {
    if (!symbol) return;

    const primarySymbol = symbol
      .replace(/,.*$/g, '')
      .replace(CurrencyCode.IOTA, 'MIOTA');

    return _.find({ symbol: primarySymbol } as Partial<CoinMarketCapCoin>, this.allCoins);
  }
}
