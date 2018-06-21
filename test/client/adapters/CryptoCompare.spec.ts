import _ from 'lodash/fp';
import CryptoCompareAdapter from 'src/client/adapters/CryptoCompareAdapter';
import { CurrencyCode, ProjectName } from 'src/client/interfaces';

describe('CryptoCompareAdapter', () => {
  let api: CryptoCompareAdapter;
  const coinNames = [ProjectName.BTC, ProjectName.ETH];

  beforeEach(() => {
    api = new CryptoCompareAdapter();
    api.setCoinList(coinNames);
  });

  describe('#getCoins', () => {
    it('fetches basic info on a given list of coins', async done => {
      await api.getCoins();
      const allCoinNames = _.map('name', api.coins);

      coinNames.forEach(coinName => expect(allCoinNames).toContain(coinName));

      done();
    });
  });

  describe('#getPrice', () => {
    it('gets the current price of a given trading pair', async () => {
      const price = await api.getPrice(CurrencyCode.Ethereum);

      expect(price).toEqual(expect.any(Number));
    });
  });
});
