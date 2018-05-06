import _ from 'lodash/fp';
import React from 'react';

import { ICryptoAsset, ProjectName } from 'src/client/interfaces';

interface ICryptoAssetTableProps {
  assets: ProjectName[];
  fieldOrder?: (keyof ICryptoAsset)[];
  loader(assets: ProjectName[]): Promise<ICryptoAsset[]>;
}

interface ICryptoAssetTableState {
  documents: ICryptoAsset[];
  loading: boolean;
}

export default class CryptoAssetTable extends React.Component<ICryptoAssetTableProps, ICryptoAssetTableState> {
  static defaultProps: Pick<ICryptoAssetTableProps, 'assets' | 'fieldOrder'> = {
    assets: [],
    fieldOrder: ['name', 'ticker', 'type', 'IsTrading', 'price']
  };

  state: ICryptoAssetTableState = {
    documents: [],
    loading: true
  };

  componentDidMount() {
    return this.loadCryptoAssets();
  }

  async loadCryptoAssets() {
    const documents = await this.props.loader(this.props.assets);
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
            {asset[field] ? asset[field].toString() : '--'}
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
