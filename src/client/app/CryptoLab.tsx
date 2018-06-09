import _ from 'lodash/fp';
import React from 'react';

import { Table } from 'src/client/components';
import { ICryptoAsset } from 'src/client/interfaces';
import { ILoaderResponse, Loader } from './loader';

interface ICryptoLabProps {
  loader: Loader;
}

interface ICryptoLabState {
  coins: ICryptoAsset[];
  loading: boolean;
}

export default class CryptoLab extends React.Component<ICryptoLabProps, ICryptoLabState> {
  state = {
    coins: [],
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

  render() {
    return (
      <React.Fragment>
        <header>
          <h1>Crypto Lab</h1>
        </header>
        <main>
          <Table
            data={this.state.coins}
            loading={this.state.loading}
          />
        </main>
      </React.Fragment>
    );
  }
}
