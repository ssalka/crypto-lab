import _ from 'lodash/fp';
import CryptoCompareAPI from 'src/client/api/CryptoCompareAPI';
import { CurrencyCode, ProjectName } from 'src/client/interfaces';

describe('CryptoCompareAPI', () => {
  let api: CryptoCompareAPI;
  const coinNames = [ProjectName.BTC, ProjectName.ETH];

  beforeEach(() => {
    api = new CryptoCompareAPI();
    api.setCoinList(coinNames);
  });

  describe('#getCoins', () => {
    it('fetches basic info on a given list of coins', async done => {
      await api.getCoins(coinNames);
      const allCoinNames = _.map('CoinName', api.coins);

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
