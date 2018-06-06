import bind from 'bind-decorator';
import _ from 'lodash/fp';
import React from 'react';

import AirtableAPI from './api/AirtableAPI';
import CoinMarketCapAPI from './api/CoinMarketCapAPI';
import CryptoCompareAPI from './api/CryptoCompareAPI';
import { CryptoAssetTable } from './components';
import { IAirtableCoin, ICoinMarketCapCoin, ICryptoCompareCoin, ICryptoAsset } from './interfaces';

interface ICryptoLabState {
  documents: ICryptoAsset[];
  loading: boolean;
}

export default class CryptoLab extends React.Component<{}, ICryptoLabState> {
  state = {
    documents: [],
    loading: true
  };

  async componentDidMount() {
    this.setState({
      documents: await this.loadCoins(),
      loading: false
    });
  }

  @bind
  async loadCoins() {
    const airtable = new AirtableAPI();

    if (!await airtable.getCoins()) return [];

    // TODO: add in other types
    const airtableCoinData = airtable.allCoins.filter(c => c.Symbol);

    const cryptoCompare = new CryptoCompareAPI();
    cryptoCompare.setCoinList(_.map('Name', airtableCoinData));

    const coinMarketCap = new CoinMarketCapAPI();
    coinMarketCap.setCoinList(_.map('Symbol', airtableCoinData));

    await Promise.all([
      coinMarketCap.getCoins(),
      cryptoCompare.getCoins()
    ]);

    return this.mapToOwnSchema(
      airtableCoinData,
      coinMarketCap.coins,
      cryptoCompare.allCoins
    );
  }

  mapToOwnSchema(
    airtableCoins: IAirtableCoin[],
    cmcCoins: ICoinMarketCapCoin[],
    ccCoins: Record<string, ICryptoCompareCoin>
  ): ICryptoAsset[] {
    return airtableCoins
      .map((coin, i) => ({
        ownCoin: coin,
        cmcCoin: cmcCoins[i],
        ccCoin: ccCoins[coin.Symbol]
      }))
      .map(({ ownCoin, cmcCoin, ccCoin }): ICryptoAsset => ({
        ...ownCoin,
        IsTrading: _.has('IsTrading', ccCoin) ? ccCoin.IsTrading : false,
        price: _.get('quotes.USD.price', cmcCoin) || 0,
        marketCap: _.get('quotes.USD.market_cap', cmcCoin) || ''
      }));
  }

  render() {
    return (
      <React.Fragment>
        <header>
          <h1>Crypto Lab</h1>
        </header>
        <main>
          <CryptoAssetTable {...this.state} />
        </main>
      </React.Fragment>
    );
  }
}
