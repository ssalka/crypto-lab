import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { toSuccessAction } from 'src/client/store/utils';
import { fetchCoins } from './api';
import { AppAction } from './types';

export const loadCoinsEpic = action$ =>
  action$.pipe(
    ofType(AppAction.LoadCoins),
    switchMap(action =>
      from(fetchCoins()).pipe(
        map(toSuccessAction(AppAction.LoadCoins))
      )
    )
  );
