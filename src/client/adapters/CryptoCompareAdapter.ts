import bind from 'bind-decorator';
import cc from 'cryptocompare';
import _ from 'lodash/fp';

import {
  INormalizedCryptoCompareCoin,
  CurrencyCode,
  ProjectName,
  ICryptoCompareCoin,
  ICryptoCompareResponse,
  Omit,
  Optional
} from 'src/client/interfaces';
import compose from 'src/client/utils/compose';

export default class CryptoCompareAdapter {
  static website = 'https://www.cryptocompare.com';

  constructor(public base: CurrencyCode = CurrencyCode.Dollar) {}

  requestedCoins: ProjectName[] = [];

  coins: Optional<INormalizedCryptoCompareCoin>[] = [];

  allCoins: ICryptoCompareResponse['Data'] = {};

  setCoinList(coinNames: ProjectName[]) {
    this.requestedCoins = coinNames;
  }

  async getCoins(): Promise<Optional<INormalizedCryptoCompareCoin>[]> {
    const { Data: allCoins } = await cc.coinList();
    this.allCoins = allCoins;
    this.coins = this.matchRequestedCoins();

    const prices = await this.fetchAllPrices();
    this.updateCoinsWithPrices(prices);

    return this.coins;
  }

  matchRequestedCoins(): Optional<INormalizedCryptoCompareCoin>[] {
    return this.requestedCoins
      .map(this.findByName)
      .map(coin => coin && this.normalizeSchema(coin));
  }

  @bind
  findByName(CoinName: ProjectName): Optional<ICryptoCompareCoin> {
    return _.find({ CoinName } as ICryptoCompareCoin, this.allCoins);
  }

  @bind
  normalizeSchema(coin: ICryptoCompareCoin): Omit<INormalizedCryptoCompareCoin, 'price'> {
    return {
      name: coin.CoinName,
      symbol: coin.Symbol,
      logo: CryptoCompareAdapter.website + coin.ImageUrl,
      trading: coin.IsTrading
    };
  }

  @bind
  fetchAllPrices(): Promise<ICryptoCompareCoin['price'][]> {
    const mapCoinsToPromises = compose<CryptoCompareAdapter['coins'], Promise<Optional<number>>[]>(
      _.map('Symbol'),
      _.map(this.getPrice)
    );

    return Promise.all(mapCoinsToPromises(this.coins));
  }

  @bind
  async getPrice(coin: CurrencyCode): Promise<Optional<number>> {
    if (!this.allCoins[coin] || !this.allCoins[coin].IsTrading) return;

    try {
      const response = await cc.price(coin, this.base);

      return response[this.base];
    }
    catch {
      console.error('Unable to fetch price of', coin);

      return 0;
    }
  }

  updateCoinsWithPrices(prices: Optional<number>[]) {
    this.coins = _.zipWith(this.assignPrice)(this.coins, prices);
  }

  @bind
  assignPrice(coin: Optional<Omit<INormalizedCryptoCompareCoin, 'price'>>, price?: number): Optional<INormalizedCryptoCompareCoin> {
    if (!coin || !price) return coin;

    return { ...coin, price };
  }
}
