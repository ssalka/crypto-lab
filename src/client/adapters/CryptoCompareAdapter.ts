import bind from 'bind-decorator';
import cc from 'cryptocompare';
import { CurrencyCode, ProjectName, ICryptoCompareCoin, ICryptoCompareResponse, ICryptoCompareSchema } from 'src/client/interfaces';
import _ from 'lodash/fp';

export default class CryptoCompareAdapter {
  constructor(public base: CurrencyCode = CurrencyCode.Dollar) {}

  requestedCoins: ProjectName[] = [];

  coins: ICryptoCompareSchema[] = [];

  allCoins: ICryptoCompareResponse['Data'] = {};

  setCoinList(coinNames: ProjectName[]) {
    this.requestedCoins = coinNames;
  }

  async getCoins(): Promise<ICryptoCompareSchema[]> {
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
    coin: ICryptoCompareCoin | ICryptoCompareSchema,
    price: number
  ): ICryptoCompareSchema {
    if (!coin) return;

    const { CoinName, IsTrading } = coin;

    return {
      CoinName,
      price,
      IsTrading
    };
  }

  @bind
  findByName(CoinName: ProjectName): ICryptoCompareCoin {
    return _.find({ CoinName } as ICryptoCompareCoin, this.allCoins);
  }
}
