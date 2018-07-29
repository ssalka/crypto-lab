import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { toSuccessAction } from 'src/client/store/utils';
import { loadEntities } from './api';
import { EntityAction } from './types';

export const loadAllEpic = action$ =>
  action$.pipe(
    ofType(EntityAction.LoadAll),
    switchMap(action =>
      from(loadEntities()).pipe(
        map(toSuccessAction(EntityAction.LoadAll))
      )
    )
  );
