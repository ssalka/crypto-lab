import React from 'react';
import { shallow } from 'enzyme';
import { CryptoLab, CryptoLabProps, ICryptoLabProps } from 'src/client/app/CryptoLab';
import { Loader } from 'src/client/app/loader';
import { ProjectName } from 'src/client/interfaces';

describe('CryptoLab', () => {
  const coinNames = [ProjectName.BTC, ProjectName.ETH];
  const loadCoins: Loader = async () => coinNames.map(name => ({ name }));
  let loaderSpy: jest.FunctionLike;

  let cryptoLab: ReturnType<typeof getComponent>;

  function getComponent(props: Partial<ICryptoLabProps> = { loader: loaderSpy }) {
    return shallow<CryptoLabProps, ICryptoLabState>(
      <CryptoLab classes={{}} {...props} />
    );
  }

  beforeEach(() => {
    loaderSpy = jest.fn(loadCoins);
  });

  describe('component mount & initial render', () => {
    it('mounts with the correct initial state', () => {
      cryptoLab = getComponent();

      const { coins, loading } = cryptoLab.state();

      expect(coins).toHaveLength(0);
      expect(loading).toBe(true);
    });

    it('starts loading the requested assets', async () => {
      cryptoLab = getComponent();

      cryptoLab.update();
      expect(loaderSpy).toHaveBeenCalled();
    });
  });

  describe('#loadCryptoAssets', () => {
    it('fetches requested data and updates component state', async () => {
      cryptoLab = getComponent();

      await cryptoLab.instance().componentDidMount();

      cryptoLab.instance().forceUpdate();

      const { coins, loading } = cryptoLab.state();

      expect(coins).toHaveLength(coinNames.length);
      expect(loading).toBe(false);
    });
  });
});
