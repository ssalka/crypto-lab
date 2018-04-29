import React from 'react';

interface ICryptoAsset {
  name: CryptoAsset;
  ticker: string;
  type: string;
}

export const enum CryptoAsset {
  BTC = 'Bitcoin',
  ETH = 'Ethereum'
}

const coins: ICryptoAsset[] = [{
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

const loadCoins = async (assets: CryptoAsset[]) => coins.filter(({ ticker }) => assets.includes(ticker as CryptoAsset));

export default class CryptoAssetTable extends React.Component<ICryptoAssetTableProps, ICryptoAssetTableState> {
  static defaultProps: ICryptoAssetTableProps = {
    assets: [],
    fieldOrder: ['name', 'ticker', 'type']
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

  render() {
    const { fieldOrder } = this.props;

    return this.state.loading ? 'Loading...' : (
      <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${fieldOrder.length}, minmax(100px, auto))` }}>
        {fieldOrder.map(field => (
          <strong key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </strong>
        ))}
        {this.state.documents.map(doc => fieldOrder.map(field => (
          <div key={field} style={styles.gridItem}>
            {doc[field]}
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
  },
  gridItem: {}
};
