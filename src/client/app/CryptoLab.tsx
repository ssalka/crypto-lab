import _ from 'lodash/fp';
import React from 'react';

import { Table, Header, SideDrawer } from 'src/client/components';
import { ICryptoAsset } from 'src/client/interfaces';
import { ILoaderResponse, Loader } from './loader';
import Theme from './Theme';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';

type CryptoLabClassName = 'root' | 'main';

interface ICryptoLabProps {
  loader: Loader;
}

interface ICryptoLabState {
  coins: ICryptoAsset[];
  drawerOpen: boolean;
  loading: boolean;
}

class CryptoLab extends React.Component<ICryptoLabProps & WithStyles<CryptoLabClassName>, ICryptoLabState> {
  state = {
    coins: [],
    drawerOpen: false,
    loading: true
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
    this.setState(prevState => ({
      drawerOpen: !prevState.drawerOpen
    }));
  }

  render() {
    const { classes } = this.props;
    const { coins, drawerOpen, loading } = this.state;

    return (
      <Theme type="light">
        <Header
          title="Crypto Lab"
          menuOpen={drawerOpen}
          onMenuToggle={this.toggleSideDrawer}
        />
        <div className={classes.root}>
          <SideDrawer
            open={drawerOpen}
            onClose={this.toggleSideDrawer}
          />
          <main className={classes.main}>
            <Table
              data={coins}
              loading={loading}
            />
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
