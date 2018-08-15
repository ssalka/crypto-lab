import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { toSuccessAction } from 'src/client/store/utils';
import { fetchCoins } from './api';
import { CoinsAction } from './types';

export const loadAllEpic = action$ =>
  action$.pipe(
    ofType(CoinsAction.LoadAll),
    switchMap(action =>
      from(fetchCoins()).pipe(
        map(toSuccessAction(CoinsAction.LoadAll))
      )
    )
  );
