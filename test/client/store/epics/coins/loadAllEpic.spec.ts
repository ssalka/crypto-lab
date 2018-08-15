import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { loadAllCoins } from 'src/client/store/coins/actions';
import * as api from 'src/client/store/coins/api';
import { loadAllEpic } from 'src/client/store/coins/epics';
import { CoinsAction } from 'src/client/store/coins/types';
import { success } from 'src/client/store/utils';

describe('loadAllEpic', () => {
  let testScheduler: TestScheduler;

  const mockFetchCoinsResponse: api.IFetchCoinsResponse[] = [{
    airtable: {},
    coinmarketCap: {},
    cryptoCompare: {}
  }];

  const mockFetchCoins: typeof api.fetchCoins = async () => mockFetchCoinsResponse;

  beforeEach(() => {
    testScheduler = new TestScheduler();
    spyOn(api, 'fetchCoins').and.callFake(mockFetchCoins);
  });

  it(`is triggered by the ${CoinsAction.LoadCoins} action`, done => {
    testScheduler.run(() => {
      const action$ = of(loadAllCoins());

      const listener = jest.fn();

      loadAllEpic(action$).subscribe(listener);

      setImmediate(() => {
        expect(listener).toHaveBeenCalled();
        done();
      });
    });
  });

  it(`is not triggered by actions other than ${CoinsAction.LoadCoins}`, () => {
    testScheduler.run(() => {
      const action$ = of({});

      const listener = jest.fn();

      loadAllEpic(action$).subscribe(listener);

      setImmediate(() => expect(listener).not.toHaveBeenCalled());
    });
  });

  it(`dispatches a ${success(CoinsAction.LoadCoins)} action upon completion`, () => {
    testScheduler.run(() => {
      const action$ = of(loadAllCoins());

      loadAllEpic(action$).subscribe(action => {
        expect(action).toEqual({
          type: success(CoinsAction.LoadCoins),
          payload: mockFetchCoinsResponse
        });

        done();
      });
    });
  });
});
