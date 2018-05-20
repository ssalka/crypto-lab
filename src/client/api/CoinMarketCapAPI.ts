import bind from 'bind-decorator';
import _ from 'lodash/fp';

import {
  CurrencyCode,
  ProjectName,
  ICoinMarketCapCoin
} from 'src/client/interfaces';

export default class CoinMarketCapAPI {
  constructor(public base: CurrencyCode = CurrencyCode.Dollar) {}

  requestedCoins: ProjectName[] = [];

  coins: ICoinMarketCapCoin[] = [];

  allCoins: ICoinMarketCapCoin[] = [];

  setCoinList(coinNames: ProjectName[]) {
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
  findByName(name: ProjectName): ICoinMarketCapCoin {
    return _.find({ name } as ICoinMarketCapCoin, this.allCoins);
  }
}
