import { mount } from 'enzyme';
import React from 'react';
import { CryptoLab, CryptoLabProps, ICryptoLabProps } from 'src/client/app/CryptoLab';
import { Loader } from 'src/client/app/loader';
import { ProjectName } from 'src/client/interfaces';
import { AppAction, initialState, loadCoins } from 'src/client/store/app';


describe('CryptoLab', () => {
  const coinNames = [ProjectName.BTC, ProjectName.ETH];
  let loadCoinsSpy: jest.FunctionLike;
  let cryptoLab: ReturnType<typeof getComponent>;

  function getComponent() {
    return mount<CryptoLabProps, ICryptoLabState>(
      <CryptoLab
        classes={{}}
        loadCoins={loadCoinsSpy}
        {...initialState}
      />
    );
  }

  beforeEach(() => {
    loadCoinsSpy = jest.fn(loadCoins);
  });

  describe('component mount & initial render', () => {
    it('mounts with the correct initial state', () => {
      cryptoLab = getComponent();

      const { coins, loading } = cryptoLab.props();

      expect(coins).toHaveLength(0);
      expect(loading).toBe(true);
    });

    it(`dispatches a ${AppAction.LoadCoins} action on mount`, async () => {
      cryptoLab = getComponent();

      expect(loadCoinsSpy).toHaveBeenCalled();
    });
  });
});
