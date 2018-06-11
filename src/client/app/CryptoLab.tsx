import _ from 'lodash/fp';
import React from 'react';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';

import { Table, Header, SideDrawer } from 'src/client/components';
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
    drawerOpen: false,
    loading: true,
    view: {
      name: ViewName.Coins,
      type: ViewType.Table
    }
  };

  async componentDidMount() {
    const response = await this.props.loader();
    const coins = this.mapToOwnSchema(response);
    this.setState({ coins, loading: false });
  }

  mapToOwnSchema(coins: ILoaderResponse[]): ICryptoAsset[] {
    return coins.map(({ airtable, coinMarketCap, cryptoCompare }: ILoaderResponse): ICryptoAsset => ({
      ...airtable,
      trading: _.has('IsTrading', cryptoCompare) ? cryptoCompare.IsTrading : false,
      price: _.get('quotes.USD.price', coinMarketCap) || 0,
      marketCap: _.get('quotes.USD.market_cap', coinMarketCap) || ''
    }));
  }

  toggleSideDrawer = () => {
    this.setState<'drawerOpen'>(prevState => ({
      drawerOpen: !prevState.drawerOpen
    }));
  }

  updateView = (name: ViewName, type: ViewType) => this.setState<'view'>({
    view: { name, type }
  })

  View = ({ type }) => {
    switch (type) {
      case ViewType.Table: {
        const { coins, loading } = this.state;

        return (
          <Table
            data={coins}
            loading={loading}
          />
        );
      }
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
            <View type={view.type} />
          </main>
        </div>
      </Theme>
    );
  }
}

const styles: StyleRulesCallback<CryptoLabClassName> = theme => ({
  root: {
    display: 'flex',
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
