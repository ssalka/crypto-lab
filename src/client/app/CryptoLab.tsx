import React, { Component, ComponentType, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { nest } from 'recompose';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';

import { Header, SideDrawer } from 'src/client/components';
import { ViewName, ViewType } from 'src/client/interfaces';
import Coins from './Coins';

const Router: typeof BrowserRouter = nest(BrowserRouter, Fragment);

type CryptoLabClassName = 'root' | 'main';

export interface ICryptoLabState {
  drawerOpen: boolean;
}

export type CryptoLabProps = WithStyles<CryptoLabClassName>;

export class CryptoLab extends Component<CryptoLabProps, ICryptoLabState> {
  state: ICryptoLabState = {
    drawerOpen: __DEV__
  };

  toggleSideDrawer = () => {
    this.setState<'drawerOpen'>(prevState => ({
      drawerOpen: !prevState.drawerOpen
    }));
  }

  render() {
    const { toggleSideDrawer } = this;
    const { classes } = this.props;
    const { drawerOpen } = this.state;

    return (
      <Router>
        <Header title="Crypto Lab" onMenuToggle={toggleSideDrawer} />
        <div className={classes.root}>
          <SideDrawer
            open={drawerOpen}
            onClose={toggleSideDrawer}
            selectedView={{
              // TODO: move to redux
              name: ViewName.Coins,
              type: ViewType.Table,
              config: {}
            }}
          />
          <main className={classes.main}>
            <Route exact={true} path="/" render={Coins.toExactPath} />
            <Route path="/coins" component={Coins} />
          </main>
        </div>
      </Router>
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

export default withStyles(styles)(CryptoLab) as ComponentType;
