import _ from 'lodash/fp';
import cc from 'cryptocompare';
import CryptoCompareAPI from 'src/client/api/CryptoCompareAPI';
import { CurrencyCode, ProjectName } from 'src/client/interfaces';

describe('CryptoCompareAPI', () => {
  describe('#getCoins', () => {
    it('fetches basic info on a given list of coins', async done => {
      const api = new CryptoCompareAPI();
      const coinNames = [ProjectName.BTC, ProjectName.ETH];

      await api.getCoins(coinNames);
      const allCoinNames = _.map('CoinName', api.coins);

      coinNames.forEach(coinName => expect(allCoinNames).toContain(coinName));

      done();
    });
  });

  describe('#getPrice', () => {
    it('gets the current price of a given trading pair', async () => {
      const api = new CryptoCompareAPI();

      const price = await api.getPrice(CurrencyCode.Ethereum);

      expect(price).toEqual(expect.any(Number));
    });
  });
});
