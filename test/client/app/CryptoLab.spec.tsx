import { mount } from 'enzyme';
import React from 'react';
import { CryptoLab, CryptoLabProps } from 'src/client/app/CryptoLab';
import { AppAction, initialState, loadCoins } from 'src/client/store/app';

describe('CryptoLab', () => {
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
