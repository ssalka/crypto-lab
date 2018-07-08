import _ from 'lodash/fp';
import React, { Component, ComponentType, Fragment } from 'react';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';

import { Header, SideDrawer } from 'src/client/components';
import { ViewName, ViewType } from 'src/client/interfaces';
import { connect } from 'src/client/store';
import { IAppState, loadCoins } from 'src/client/store/app';
import { compose } from 'src/client/utils';
import Router from './Router';

type CryptoLabClassName = 'root' | 'main';

interface ICryptoLabActions {
  loadCoins: typeof loadCoins;
}

export interface ICryptoLabState {
  drawerOpen: boolean;
}

export type CryptoLabProps = IAppState & ICryptoLabActions & WithStyles<CryptoLabClassName>;

export class CryptoLab extends Component<CryptoLabProps, ICryptoLabState> {
  state: ICryptoLabState = {
    drawerOpen: __DEV__
  };

  async componentDidMount() {
    this.props.loadCoins();
  }

  toggleSideDrawer = () => {
    this.setState<'drawerOpen'>(prevState => ({
      drawerOpen: !prevState.drawerOpen
    }));
  }

  render() {
    const { toggleSideDrawer } = this;
    const { classes, loading } = this.props;
    const { drawerOpen } = this.state;

    return (
      <Fragment>
        <Header title="Crypto Lab" onMenuToggle={toggleSideDrawer} />
        <div className={classes.root}>
          <SideDrawer
            open={drawerOpen}
            onClose={toggleSideDrawer}
            onSelectView={_.noop}
            selectedView={{
              // TODO: move to redux
              name: ViewName.Coins,
              type: ViewType.Table,
              config: {}
            }}
          />
          <main className={classes.main}>
            {
              // TODO: loading spinner
              !loading && <Router />
            }
          </main>
        </div>
      </Fragment>
    );
  }
}

const styles: StyleRulesCallback<CryptoLabClassName> = theme => ({
  root: {
    display: 'flex',
    fontFamily: 'Roboto, Arial, sans-serif',
    maxWidth: '100vw',
    maxHeight: 'calc(100vh - 56px)',
    overflow: 'hidden'
  },
  main: {
    flexGrow: 1,
    overflow: 'auto'
  }
});

export default compose(
  connect(
    // TODO: break up store per aggregate type
    store => store.app,
    actions => actions.app
  ),
  withStyles(styles)
)(CryptoLab) as ComponentType;
