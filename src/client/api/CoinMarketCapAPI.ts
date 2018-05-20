import bind from 'bind-decorator';
import _ from 'lodash/fp';

import {
  CurrencyCode,
  ICoinMarketCapCoin
} from 'src/client/interfaces';

export default class CoinMarketCapAPI {
  constructor(public base: CurrencyCode = CurrencyCode.Dollar) {}

  requestedCoins: CurrencyCode[] = [];

  coins: ICoinMarketCapCoin[] = [];

  allCoins: ICoinMarketCapCoin[] = [];

  setCoinList(coinNames: CurrencyCode[]) {
    this.requestedCoins = coinNames;
  }

  async getCoins(): Promise<ICoinMarketCapCoin[]> {
    this.cacheCoins(await fetch('/cmc').then(_.invoke('json')));

    return this.coins;
  }

  cacheCoins(allCoins: ICoinMarketCapCoin[]) {
    this.allCoins = allCoins;
    this.coins = this.requestedCoins.map(this.findByName);
  }

  @bind
  findByName(symbol: CurrencyCode): ICoinMarketCapCoin {
    const primarySymbol = symbol
      .replace(/,.*$/g, '')
      .replace(CurrencyCode.IOTA, 'MIOTA');

    return _.find({ symbol: primarySymbol } as ICoinMarketCapCoin, this.allCoins);
  }
}
