import _ from 'lodash/fp';
import React, { Component, ComponentType, Fragment } from 'react';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';

import { Project, Table, Header, SideDrawer } from 'src/client/components';
import { ICryptoAsset, IView, ViewName, ViewType } from 'src/client/interfaces';
import { IAppState, loadCoins } from 'src/client/store/app';
import { connect } from 'src/client/store';
import { compose } from 'src/client/utils';

type CryptoLabClassName = 'root' | 'main';

interface ICryptoLabProps extends IAppState {
  loadCoins: typeof loadCoins;
}

export interface ICryptoLabState {
  drawerOpen: boolean;
  view: IView;
}

export type CryptoLabProps = ICryptoLabProps & WithStyles<CryptoLabClassName>;

export class CryptoLab extends Component<CryptoLabProps, ICryptoLabState> {
  state: ICryptoLabState = {
    drawerOpen: __DEV__,
    view: {
      name: ViewName.Coins,
      type: ViewType.Table,
      config: {}
    }
  };

  static views: Record<ViewName, Record<ViewType, (props, state) => any>> = {
    [ViewName.Coins]: {
      [ViewType.Table]: (props, state) => ({
        data: props.coins,
        loading: props.loading
      }),
      [ViewType.Project]: (props, state) => {
        const { data: coin } = state.view.config;

        return !coin ? null : {
          ...coin,
          website: coin.officialWebsite
        };
      }
    }
  };

  getViewProps({ name, type }: IView) {
    if (_.has(`${name}.${type}`, CryptoLab.views)) {
      const getProps = CryptoLab.views[name][type];

      return getProps(this.props, this.state);
    }

    console.warn('Unsupported view options:', { name, type });

    return null;
  }

  async componentDidMount() {
    this.props.loadCoins();
  }

  toggleSideDrawer = () => {
    this.setState<'drawerOpen'>(prevState => ({
      drawerOpen: !prevState.drawerOpen
    }));
  }

  updateView = (name: ViewName, type: ViewType, config: IView['config'] = {}) => {
    this.setState<'view'>({
      view: { name, type, config }
    });
  }

  goToProject = (event, project: ICryptoAsset) => {
    this.updateView(ViewName.Coins, ViewType.Project, {
      data: project
    });
  }

  View = (view: IView): JSX.Element => {
    // TODO: infer prop types from view
    const props = this.getViewProps(view);

    switch (view.type) {
      case ViewType.Table:
        return (
          <Table
            {...props}
            onRowClick={this.goToProject}
          />
        );
      case ViewType.Project:
        return <Project {...props} />;
    }
  }

  render() {
    const { toggleSideDrawer, updateView, View } = this;
    const { classes } = this.props;
    const { drawerOpen, view } = this.state;

    return (
      <Fragment>
        <Header title="Crypto Lab" onMenuToggle={toggleSideDrawer} />
        <div className={classes.root}>
          <SideDrawer
            open={drawerOpen}
            onClose={toggleSideDrawer}
            onSelectView={updateView}
            selectedView={view}
          />
          <main className={classes.main}>
            <View {...view} />
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
