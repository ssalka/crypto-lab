import _ from 'lodash/fp';
import React, { ComponentType } from 'react';
import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';
import Table, { TableClassKey } from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { SortDirection } from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import { ICryptoAsset } from 'src/client/interfaces';
import { formatUSD } from 'src/client/utils';
import TableHead from './TableHead';

const numericalFields: FieldName[] = ['price', 'marketCap'];

type FieldName = keyof ICryptoAsset;

type TableClassName = TableClassKey | 'table' | 'logo';

const styles: StyleRulesCallback<TableClassName> = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    minWidth: Math.min(1020, window.innerWidth)
  },
  logo: {
    maxWidth: 30,
    height: 'auto'
  }
});

interface ITableProps {
  data: ICryptoAsset[];
  loading: boolean;
  fieldOrder?: FieldName[];
}

interface ITableState {
  order?: SortDirection;
  orderBy: string;
  data: ICryptoAsset[];
  page: number;
  rowsPerPage: number;
}

type TableProps = ITableProps & WithStyles<TableClassName>;

const initialState: Pick<ITableState, 'order' | 'page' | 'rowsPerPage'> = {
  page: 0,
  rowsPerPage: 25
};

class EnhancedTable extends React.Component<TableProps, ITableState> {
  static defaultProps = {
    fieldOrder: ['Logo', 'Name', 'Symbol', 'Category', 'trading', ...numericalFields] as FieldName[]
  };

  idKey = 'Name';

  state: ITableState = {
    orderBy: this.idKey,
    data: this.props.data,
    ...initialState
  };

  compareItems = (prev, next) => {
    return prev[this.idKey] === next[this.idKey];
  }

  dataChanged(prevData, nextData) {
    return _.every([
      prevData.length === nextData.length,
      // TODO: figure out _.zipWith typings...
      ..._.zip<ICryptoAsset, ICryptoAsset>(prevData, nextData).map(this.compareItems)
    ]);
  }

  componentWillReceiveProps(nextProps) {
    const finishedLoading = this.props.loading && !nextProps.loading;
    const dataChanged = this.dataChanged(this.props.data, nextProps.data);

    if (finishedLoading || dataChanged) {
      this.setState({ data: nextProps.data });
    }
  }

  handleRequestSort = (event, orderBy: string, nextData?: ITableState['data']) => {
    const reverseOrder = this.state.orderBy === orderBy && this.state.order === 'asc';
    const order: SortDirection = reverseOrder ? 'desc' : 'asc';

    const sort: (items: ICryptoAsset[]) => ICryptoAsset[] = _.flow(
      _.sortBy(orderBy),
      reverseOrder ? _.reverse : _.identity
    ) as any;

    const data = sort(nextData || this.state.data);

    this.setState({
      data,
      orderBy,
      order
    });
  }

  changePage = (event, page) => {
    this.setState({ page });
  }

  changePageSize = event => {
    this.setState({ rowsPerPage: event.target.value });
  }

  formatFieldValue(value: any, key: FieldName) {
    if (_.isArray(value)) {
      return _.has('url', value[0])
        ? <img src={value[0].url} className={this.props.classes.logo} />
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
    const { classes, fieldOrder } = this.props;
    const { data, order, orderBy, page, rowsPerPage } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const [firstField, ...otherFields] = fieldOrder;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <TableHead
              headers={fieldOrder.map(field => ({ id: field, label: field }))}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => (
                <TableRow
                  hover={true}
                  tabIndex={-1}
                  key={n[this.idKey]}
                >
                  <TableCell component="th" scope="row">
                    {this.formatFieldValue(n[firstField], firstField)}
                  </TableCell>
                  {otherFields.map(field => (
                    <TableCell key={field}>{this.formatFieldValue(n[field], field)}</TableCell>
                  ))}
                </TableRow>
              ))}
              {!!emptyRows && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={this.changePage}
          onChangeRowsPerPage={this.changePageSize}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(EnhancedTable) as ComponentType<ITableProps>;
