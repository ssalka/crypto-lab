import { ComponentType } from 'react';
import { connect as reduxConnect } from 'react-redux';
import { Action, bindActionCreators } from 'redux';
import * as storeActions from './actions';

// TSLint bug introduced in TypeScript 2.9 - see issue #3987
// tslint:disable:whitespace
type StoreActionsMap = typeof import('./actions');
type StoreState = typeof import('./state');
// tslint:enable:whitespace

function bindActions(mapActionsToProps) {
  return dispatch => bindActionCreators(
    mapActionsToProps(storeActions),
    dispatch
  );
}

export function connect<S, A = {}>(
  mapStateToProps: (state: StoreState) => S,
  mapActionsToProps?: (actions: StoreActionsMap) => A
): <P>(Component: ComponentType<P>) => ComponentType<P & S> {
  return reduxConnect(
    mapStateToProps,
    mapActionsToProps ? bindActions(mapActionsToProps) : () => ({})
  );
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
