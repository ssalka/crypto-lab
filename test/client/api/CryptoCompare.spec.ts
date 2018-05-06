import _ from 'lodash/fp';
import cc from 'cryptocompare';
import CryptoCompareAPI from 'src/client/api/CryptoCompareAPI';
import { ProjectName } from 'src/client/interfaces';

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
});
