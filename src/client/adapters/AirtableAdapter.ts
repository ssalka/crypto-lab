import _ from 'lodash/fp';

import {
  ProjectName,
  IAirtableCoin,
  INormalizedAirtableCoin
} from 'src/client/interfaces';

export default class AirtableAdapter {
  requestedCoins: ProjectName[] = [];

  coins: INormalizedAirtableCoin[] = [];

  allCoins: IAirtableCoin[] = [];

  setCoinList(coinNames: ProjectName[]) {
    this.requestedCoins = coinNames;
  }

  async getCoins(): Promise<INormalizedAirtableCoin[]> {
    try {
      this.cacheCoins(await fetch('/airtable').then(_.invoke('json')));
    }
    catch (e) {
      console.error(e);
    }

    return this.coins;
  }

  cacheCoins(allCoins: IAirtableCoin[]) {
    this.allCoins = allCoins;
    this.coins = _.flow(
      _.filter('Symbol'),
      _.map(_.mapKeys(_.camelCase)),
      _.map(_.omit('marketCap')) // conflicts with cmc
    )(this.allCoins) as INormalizedAirtableCoin[];
  }
}
