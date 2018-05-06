import React from 'react';
import { shallow, mount } from 'enzyme';
import { CryptoAssetTable } from 'src/client/components';
import { CryptoAsset } from 'src/client/interfaces';

describe('CryptoAssetTable', () => {
  const { initialValue } = CryptoAssetTable.defaultProps;
  const loadCoins = async (coinNames: CryptoAsset[]) => coinNames.map(name => ({ name }));
  let loaderSpy: jest.FunctionLike;

  beforeEach(() => {
    loaderSpy = jest.fn(loadCoins);
  });

  describe('component mount & initial render', () => {
    it('mounts with the correct initial state', () => {
      const table = shallow(<CryptoAssetTable loader={loaderSpy} />);

      expect(table.state()).toEqual({
        loading: true,
        documents: []
      });

      expect(table.text()).toBe('Loading...');
    });

    it('starts loading the requested assets', async () => {
      const table = shallow(<CryptoAssetTable loader={loaderSpy} />);

      table.update();
      expect(loaderSpy).toHaveBeenCalled();
    });
  });

  describe('#loadCryptoAssets', () => {
    it('fetches requested data and updates component state', async () => {
      const assets = [CryptoAsset.BTC];
      const table = shallow(<CryptoAssetTable assets={assets} loader={loaderSpy} />);

      await table.instance().loadCryptoAssets();

      table.instance().forceUpdate();

      const { documents, loading } = table.state();

      expect(loading).toBe(false);
      expect(documents).toHaveLength(assets.length);
    });
  });
});
