import bind from 'bind-decorator';
import cc from 'cryptocompare';
import _ from 'lodash/fp';

import {
  INormalizedCryptoCompareCoin,
  CurrencyCode,
  ProjectName,
  ICryptoCompareCoin,
  ICryptoCompareResponse,
  Omit
} from 'src/client/interfaces';

export default class CryptoCompareAdapter {
  static website = 'https://www.cryptocompare.com';

  constructor(public base: CurrencyCode = CurrencyCode.Dollar) {}

  requestedCoins: ProjectName[] = [];

  coins: INormalizedCryptoCompareCoin[] = [];

  allCoins: ICryptoCompareResponse['Data'] = {};

  setCoinList(coinNames: ProjectName[]) {
    this.requestedCoins = coinNames;
  }

  async getCoins(): Promise<INormalizedCryptoCompareCoin[]> {
    const response = await cc.coinList();
    this.matchRequestedCoins(response);

    const prices = await this.fetchAllPrices(response);
    this.updateCoinsWithPrices(prices);

    return this.coins;
  }

  matchRequestedCoins({ Data: allCoins }: ICryptoCompareResponse) {
    this.allCoins = allCoins;
    this.coins = this.requestedCoins
      .map(this.findByName)
      .map(this.normalizeSchema);
  }

  @bind
  async fetchAllPrices(coins: ICryptoCompareCoin[]): Promise<number[]> {
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

  @bind
  findByName(CoinName: ProjectName): ICryptoCompareCoin {
    return _.find({ CoinName } as ICryptoCompareCoin, this.allCoins) || null;
  }

  @bind
  normalizeSchema(coin: ICryptoCompareCoin | null): Omit<INormalizedCryptoCompareCoin, 'price'> {
    if (!coin) return null;

    return {
      name: coin.CoinName,
      symbol: coin.Symbol,
      logo: CryptoCompareAdapter.website + coin.ImageUrl,
      trading: coin.IsTrading
    };
  }

  updateCoinsWithPrices(prices: number[]) {
    this.coins = _.zipWith(this.assignPrice)(this.coins, prices);
  }

  @bind
  assignPrice(coin: Omit<INormalizedCryptoCompareCoin, 'price'>, price: number): INormalizedCryptoCompareCoin {
    return { ...coin, price };
  }
}
