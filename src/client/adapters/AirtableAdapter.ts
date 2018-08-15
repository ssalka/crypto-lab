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
      this.cacheCoins(await fetch('/airtable/coins').then(_.invoke('json')));
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
      _.map(_.omit('marketCap')) // conflicts with cmc marketCap field
    )(this.allCoins) as INormalizedAirtableCoin[];

    // TODO: more functional way to override individual fields
    _.filter('logo', this.coins).forEach(this.takeFirstLogo);
  }

  takeFirstLogo(coin) {
    if (coin.logo.length) {
      const logo: string = coin.logo[0].url;

      coin.logo = logo;
    }
    else {
      delete coin.logo;
    }
  }
}
