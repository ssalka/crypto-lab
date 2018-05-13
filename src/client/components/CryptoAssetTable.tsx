import _ from 'lodash/fp';
import React from 'react';

import { ICryptoAsset, ProjectName } from 'src/client/interfaces';
import { formatUSD } from 'src/client/utils';

type FieldName = keyof ICryptoAsset;

interface ICryptoAssetTableProps {
  assets: ProjectName[];
  fieldOrder?: FieldName[];
  loader(assets: ProjectName[]): Promise<ICryptoAsset[]>;
}

interface ICryptoAssetTableState {
  documents: ICryptoAsset[];
  loading: boolean;
}

const numericalFields: FieldName[] = ['price', 'marketCap'];

export default class CryptoAssetTable extends React.Component<ICryptoAssetTableProps, ICryptoAssetTableState> {
  static defaultProps: Pick<ICryptoAssetTableProps, 'assets' | 'fieldOrder'> = {
    assets: [],
    fieldOrder: ['Logo', 'Name', 'Symbol', 'Category', 'IsTrading', ...numericalFields]
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

  formatFieldValue(value: any, key: FieldName) {
    if (_.isArray(value)) {
      return _.has('url', value[0])
        ? <img src={value[0].url} style={styles.logo} />
        : value.join(', ');
    }
    else if (_.isObject(value)) {
      return JSON.stringify(value);
    }
    else if (numericalFields.includes(key)) {
      return formatUSD(value);
    }
    else {
      return _.isBoolean(value) ? value.toString() : value || '--';
    }
  }

  render() {
    const { fieldOrder } = this.props;

    return this.state.loading ? 'Loading...' : (
      <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${fieldOrder.length}, minmax(100px, auto))` }}>
        {fieldOrder.map(this.formatFieldName).map(fieldName => (
          <strong key={fieldName}>
            {fieldName}
          </strong>
        ))}
        {this.state.documents.map(asset => fieldOrder.map(fieldName => (
          <div key={fieldName}>
            {this.formatFieldValue(asset[fieldName], fieldName)}
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
    gridRowGap: '0.5em',
    alignItems: 'center'
  },
  logo: {
    maxWidth: 30,
    height: 'auto'
  }
};
