import _ from 'lodash/fp';
import React from 'react';

import CryptoCompareAPI from 'src/client/api/CryptoCompare';
import { CryptoAsset, ICryptoAsset, ICryptoAssetCustom, ICryptoCompareCoin } from 'src/client/interfaces';

const coins: ICryptoAssetCustom[] = [{
  name: CryptoAsset.BTC,
  ticker: 'Bitcoin',
  type: 'Cryptocurrency'
}, {
  name: CryptoAsset.ETH,
  ticker: 'Ethereum',
  type: 'Smart Contract Platform'
}];

interface ICryptoAssetTableProps {
  assets: CryptoAsset[];
  fieldOrder?: (keyof ICryptoAsset)[];
}

interface ICryptoAssetTableState {
  documents: ICryptoAsset[];
  loading: boolean;
}

const cryptoCompare = new CryptoCompareAPI();

const loadCoins = async (assets: CryptoAsset[]) => {
  const ccCoinData: ICryptoCompareCoin[] = await cryptoCompare.getCoins(assets);
  const ownCoinData: ICryptoAssetCustom[] = assets.map(asset => coins.find(({ ticker }) => ticker === asset));

  return assets.map((asset, i) => ({ ...ownCoinData[i], ...ccCoinData[i] }));
};

export default class CryptoAssetTable extends React.Component<ICryptoAssetTableProps, ICryptoAssetTableState> {
  static defaultProps: ICryptoAssetTableProps = {
    assets: [],
    fieldOrder: ['name', 'ticker', 'type', 'IsTrading']
  };

  state: ICryptoAssetTableState = {
    documents: [],
    loading: true
  };

  componentDidMount() {
    return this.loadCryptoAssets();
  }

  async loadCryptoAssets() {
    const documents = await loadCoins(this.props.assets);
    this.setState({ documents, loading: false });
  }

  formatFieldName: (fieldName: string) => string = _.flow(
    _.words,
    _.map(_.capitalize),
    _.join(' ')
  );

  render() {
    const { fieldOrder } = this.props;

    return this.state.loading ? 'Loading...' : (
      <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${fieldOrder.length}, minmax(100px, auto))` }}>
        {fieldOrder.map(this.formatFieldName).map(fieldName => (
          <strong key={fieldName}>
            {fieldName}
          </strong>
        ))}
        {this.state.documents.map(asset => fieldOrder.map(field => (
          <div key={field}>
            {asset[field].toString()}
          </div>
        )))}
      </div>
    );
  }
}

const styles = {
  grid: {
    fontFamily: 'Arial',
    display: 'grid',
    gridRowGap: '1em'
  }
};
