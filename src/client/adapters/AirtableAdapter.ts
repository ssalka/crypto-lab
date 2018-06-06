import bind from 'bind-decorator';
import _ from 'lodash/fp';

import {
  ProjectName,
  IAirtableCoin
} from 'src/client/interfaces';

export default class AirtableAdapter {
  requestedCoins: ProjectName[] = [];

  coins: IAirtableCoin[] = [];

  allCoins: IAirtableCoin[] = [];

  setCoinList(coinNames: ProjectName[]) {
    this.requestedCoins = coinNames;
  }

  async getCoins(): Promise<IAirtableCoin[]> {
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
    this.coins = _.compact(this.requestedCoins.map(this.findByName));
  }

  @bind
  findByName(Name: ProjectName): IAirtableCoin {
    return _.find({ Name } as Partial<IAirtableCoin>, this.allCoins);
  }
}
