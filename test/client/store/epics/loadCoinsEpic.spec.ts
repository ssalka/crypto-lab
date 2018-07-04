import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { loadCoins } from 'src/client/store/app/actions';
import * as api from 'src/client/store/app/api';
import { loadCoinsEpic } from 'src/client/store/app/epics';
import { AppAction } from 'src/client/store/app/types';
import { success } from 'src/client/store/utils';

describe('loadCoinsEpic', () => {
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

  it(`is triggered by the ${AppAction.LoadCoins} action`, done => {
    testScheduler.run(() => {
      const action$ = of(loadCoins());

      const listener = jest.fn();

      loadCoinsEpic(action$).subscribe(listener);

      setImmediate(() => {
        expect(listener).toHaveBeenCalled();
        done();
      });
    });
  });

  it(`is not triggered by actions other than ${AppAction.LoadCoins}`, () => {
    testScheduler.run(() => {
      const action$ = of({});

      const listener = jest.fn();

      loadCoinsEpic(action$).subscribe(listener);

      setImmediate(() => expect(listener).not.toHaveBeenCalled());
    });
  });

  it(`dispatches a ${success(AppAction.LoadCoins)} action upon completion`, () => {
    testScheduler.run(() => {
      const action$ = of(loadCoins());

      loadCoinsEpic(action$).subscribe(action => {
        expect(action).toEqual({
          type: success(AppAction.LoadCoins),
          payload: mockFetchCoinsResponse
        });

        done();
      });
    });
  });
});
