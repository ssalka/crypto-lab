import _ from 'lodash/fp';
import React from 'react';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';

import { Project, Table, Header, SideDrawer } from 'src/client/components';
import { ICryptoAsset, IView, ViewName, ViewType } from 'src/client/interfaces';
import { ILoaderResponse, Loader } from './loader';
import Theme from './Theme';

type CryptoLabClassName = 'root' | 'main';

interface ICryptoLabProps {
  loader: Loader;
}

export interface ICryptoLabState {
  coins: ICryptoAsset[];
  drawerOpen: boolean;
  loading: boolean;
  view: IView;
}

export type CryptoLabProps = ICryptoLabProps & WithStyles<CryptoLabClassName>;

export class CryptoLab extends React.Component<CryptoLabProps, ICryptoLabState> {
  state = {
    coins: [],
    drawerOpen: __DEV__,
    loading: true,
    view: {
      name: ViewName.Coins,
      type: ViewType.Table,
      config: {}
    }
  };

  static views: Record<ViewName, Record<ViewType, (props, state) => any>> = {
    [ViewName.Coins]: {
      [ViewType.Table]: (props, state) => ({
        data: state.coins,
        loading: state.loading
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
    const response = await this.props.loader();
    console.log(response);
    const coins = this.mapToOwnSchema(response);
    this.setState({ coins, loading: false });
  }

  mapToOwnSchema(coins: ILoaderResponse[]): ICryptoAsset[] {
    return coins.map(({ airtable, coinMarketCap, cryptoCompare }: ILoaderResponse): ICryptoAsset => ({
      ...cryptoCompare,
      ...coinMarketCap,
      ...airtable
    }));
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
    const props: any = this.getViewProps(view);

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
      <Theme type="light">
        <Header
          title="Crypto Lab"
          menuOpen={drawerOpen}
          onMenuToggle={toggleSideDrawer}
        />
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
      </Theme>
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
  },
});

export default withStyles(styles)(CryptoLab);
