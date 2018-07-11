import { mount } from 'enzyme';
import React from 'react';
import { Coins, CoinsProps } from 'src/client/app/Coins';
import { AppAction, initialState, loadCoins } from 'src/client/store/app';

describe('Coins', () => {
  let loadCoinsSpy: jest.FunctionLike;
  let cryptoLab: ReturnType<typeof getComponent>;

  function getComponent() {
    return mount<CoinsProps, ICoinsState>(
      <Coins
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
