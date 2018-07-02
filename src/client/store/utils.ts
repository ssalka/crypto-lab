import { connect as reduxConnect } from 'react-redux';
import { Action, bindActionCreators } from 'redux';
import * as appActions from './app/actions';

const allActions = {
  app: appActions
};

function bindActions(mapActionsToProps) {
  return dispatch => bindActionCreators(
    mapActionsToProps(allActions),
    dispatch
  );
}

export function connect<S, A>(
  mapStateToProps: (store: any) => S,
  mapActionsToProps: (actions: typeof allActions) => A
) {
  return reduxConnect(mapStateToProps, bindActions(mapActionsToProps));
}

const enum RequestStatus {
  Pending = 'REQUEST_PENDING',
  Succeeded = 'REQUEST_SUCCEEDED',
  Failed = 'REQUEST_FAILED',
  Cancelled = 'REQUEST_CANCELLED'
}

interface IActionWithPayload<P> extends Action {
  payload: P;
}

export function success(actionType: string): string {
  return `${actionType}_${RequestStatus.Succeeded}`;
}

export function toSuccessAction<P>(actionType: string): (payload: P) => IActionWithPayload<P> {
  return payload => ({
    type: success(actionType),
    payload
  });
}
