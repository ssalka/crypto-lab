import React from 'react';
import { shallow, mount } from 'enzyme';
import { CryptoLab, Loader } from 'src/client/app';
import { ProjectName } from 'src/client/interfaces';

describe('CryptoLab', () => {
  const coinNames = [ProjectName.BTC, ProjectName.ETH];
  const loadCoins: Loader = async () => coinNames.map(name => ({ name }));
  let loaderSpy: jest.FunctionLike;

  beforeEach(() => {
    loaderSpy = jest.fn(loadCoins);
  });

  describe('component mount & initial render', () => {
    it('mounts with the correct initial state', () => {
      const lab = shallow(<CryptoLab loader={loaderSpy} />);

      const { coins, loading } = lab.state();

      expect(coins).toHaveLength(0);
      expect(loading).toBe(true);
    });

    it('starts loading the requested assets', async () => {
      const lab = shallow(<CryptoLab loader={loaderSpy} />);

      lab.update();
      expect(loaderSpy).toHaveBeenCalled();
    });
  });

  describe('#loadCryptoAssets', () => {
    it('fetches requested data and updates component state', async () => {
      const lab = shallow(<CryptoLab loader={loaderSpy} />);

      await lab.instance().componentDidMount();

      lab.instance().forceUpdate();

      const { coins, loading } = lab.state();

      expect(coins).toHaveLength(coinNames.length);
      expect(loading).toBe(false);
    });
  });
});
