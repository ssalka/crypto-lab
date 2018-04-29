import React from 'react';
import { shallow, mount } from 'enzyme';
import CryptoAssetTable, { CryptoAsset } from 'src/client/components/CryptoAssetTable';

describe('CryptoAssetTable', () => {
  const { initialValue } = CryptoAssetTable.defaultProps;

  describe('component mount & initial render', () => {
    it('mounts with the correct initial state', () => {
      const table = shallow(<CryptoAssetTable />);

      expect(table.state()).toEqual({
        loading: true,
        documents: []
      });

      expect(table.text()).toBe('Loading...');
    });

    it('starts loading the requested assets', async () => {
      const loadSpy = spyOn(CryptoAssetTable.prototype, 'loadCryptoAssets');
      const table = shallow(<CryptoAssetTable />);

      table.update();

      expect(loadSpy).toHaveBeenCalled();
    });
  });

  describe('#loadCryptoAssets', () => {
    it('fetches requested data and updates component state', async () => {
      const assets = [CryptoAsset.BTC];
      const table = shallow(<CryptoAssetTable assets={assets} />);

      await table.instance().loadCryptoAssets();

      table.instance().forceUpdate();

      const { documents, loading } = table.state();

      expect(loading).toBe(false);
      expect(documents).toHaveLength(assets.length);
    });
  });
});
