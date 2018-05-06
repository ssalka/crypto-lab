import bind from 'bind-decorator';
import cc from 'cryptocompare';
import { CryptoAsset, ICryptoCompareCoin, ICryptoCompareResponse } from 'src/client/interfaces';
import _ from 'lodash/fp';

export default class CryptoCompareAPI {
  coins: ICryptoCompareCoin[] = [];

  async getCoins(coinNames: CryptoAsset[]): Promise<ICryptoCompareCoin[]> {
    this.cacheCoins(await cc.coinList());

    return coinNames
      .map(this.findByName)
      .filter(_.identity);
  }

  cacheCoins({ Data: coinsBySymbol }: ICryptoCompareResponse) {
    this.coins = _.values(coinsBySymbol);
  }

  @bind
  findByName(CoinName: string): ICryptoCompareCoin {
    return _.find({ CoinName }, this.coins);
  }
}
