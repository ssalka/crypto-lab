import { mount } from 'enzyme';
import React from 'react';
import { Coins, CoinsProps } from 'src/client/app/Coins';
import { CoinsAction, initialState, loadCoins } from 'src/client/store/coins';

describe('Coins', () => {
  let loadCoinsSpy: jest.FunctionLike;
  let cryptoLab: ReturnType<typeof getComponent>;

  function getComponent() {
    return mount<CoinsProps, ICoinsState>(
      <Coins
        classes={{}}
        loadAllCoins={loadCoinsSpy}
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

      const { all, loading } = cryptoLab.props();

      expect(all).toHaveLength(0);
      expect(loading).toBe(true);
    });

    it(`dispatches a ${CoinsAction.LoadAll} action on mount`, async () => {
      cryptoLab = getComponent();

      expect(loadCoinsSpy).toHaveBeenCalled();
    });
  });
});
