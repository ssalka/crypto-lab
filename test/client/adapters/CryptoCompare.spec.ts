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
    const ETH = CurrencyCode.Ethereum;

    it('gets the current price of a given trading pair', async () => {
      api.allCoins[ETH] = {
        IsTrading: true
      };

      const price = await api.getPrice(ETH);

      expect(price).toEqual(expect.any(Number));
    });

    it("returns undefined if coin isn't found", async () => {
      expect(api.allCoins[ETH]).toBeUndefined();

      spyOn(api, 'getPrice');

      expect(await api.getPrice(ETH)).toBeUndefined();
    });

    it("returns undefined if coin isn't trading", async () => {
      api.allCoins[ETH] = {
        IsTrading: false
      };

      spyOn(api, 'getPrice');

      expect(await api.getPrice(ETH)).toBeUndefined();
    });
  });
});
