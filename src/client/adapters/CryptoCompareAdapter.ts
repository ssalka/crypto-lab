import bind from 'bind-decorator';
import cc from 'cryptocompare';
import _ from 'lodash/fp';

import {
  CryptoCompareCoin,
  CurrencyCode,
  ProjectName,
  ICryptoCompareResponse
} from 'src/client/interfaces';

export default class CryptoCompareAdapter {
  constructor(public base: CurrencyCode = CurrencyCode.Dollar) {}

  requestedCoins: ProjectName[] = [];

  coins: CryptoCompareCoin[] = [];

  allCoins: ICryptoCompareResponse['Data'] = {};

  setCoinList(coinNames: ProjectName[]) {
    this.requestedCoins = coinNames;
  }

  async getCoins(): Promise<CryptoCompareCoin[]> {
    this.cacheCoins(await cc.coinList());
    this.updateCoinPrices(await this.getAllPrices());

    return this.coins;
  }

  @bind
  async getAllPrices(): Promise<number[]> {
    const getPricefromSymbol = _.flow(
      _.map('Symbol'),
      _.map(this.getPrice)
    );

    return Promise.all(getPricefromSymbol(this.coins));
  }

  @bind
  async getPrice(coin: CurrencyCode, base: CurrencyCode = this.base): Promise<number> {
    if (!this.allCoins[coin] || !this.allCoins[coin].IsTrading) return 0;

    try {
      const { [base]: price } = await cc.price(coin, base);

      return price;
    }
    catch {
      console.error('Unable to fetch price of', coin);

      return 0;
    }
  }

  cacheCoins({ Data: allCoins }: ICryptoCompareResponse) {
    this.allCoins = allCoins;
    this.coins = this.requestedCoins.map(this.findByName);
  }

  updateCoinPrices(prices: number[]) {
    this.coins = _.zipWith(this.updateCoinPrice)(this.coins, prices);
  }

  @bind
  updateCoinPrice(
    coin: CryptoCompareCoin,
    price: number
  ): CryptoCompareCoin {
    if (!coin) return coin;

    return {
      ...coin,
      price
    };
  }

  @bind
  findByName(CoinName: ProjectName): CryptoCompareCoin {
    return _.find({ CoinName } as CryptoCompareCoin, this.allCoins);
  }
}
