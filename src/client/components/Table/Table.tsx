import _ from 'lodash/fp';
import React, { ComponentType, ReactNode } from 'react';

import Table, { TableClassKey } from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { SortDirection } from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';

import { ICryptoAsset, FieldName } from 'src/client/interfaces/crypto';
import { formatUSD } from 'src/client/utils';
import TableHead from './TableHead';
import TableRow from './TableRow';
import * as columns from './columns';

type TableClassName = TableClassKey | 'table' | 'row' | 'logo' | 'paginator';

interface ITableProps {
  data: ICryptoAsset[];
  loading: boolean;
  columnOrder?: FieldName[];
  onRowClick?(event, row: ICryptoAsset): void;
}

interface ITableState {
  order: SortDirection;
  orderBy: string;
  data: ICryptoAsset[];
  page: number;
  rowsPerPage: number;
}

type TableProps = ITableProps & WithStyles<TableClassName>;

class EnhancedTable extends React.Component<TableProps, ITableState> {
  static defaultProps = {
    columnOrder: columns.defaultOrder
  };

  idKey = 'name';

  state: ITableState = {
    order: 'asc',
    orderBy: this.idKey,
    page: 0,
    rowsPerPage: 25,
    data: this.props.data
  };

  compareItems = (prev, next) => {
    return prev[this.state.orderBy] === next[this.state.orderBy];
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

  createRowClickHandler = row => event => {
    if (this.props.onRowClick) {
      this.props.onRowClick(event, row);
    }
  }

  formatCellValue(value: any, key: FieldName): ReactNode {
    let formattedValue: ReactNode;

    if (_.isArray(value)) {
      formattedValue = _.has('url', value[0])
        ? <img src={value[0].url} className={this.props.classes.logo} />
        : value.join(', ');
    }
    else if (_.isObject(value)) {
      formattedValue = JSON.stringify(value);
    }
    else if (columns.monetary.includes(key)) {
      formattedValue = formatUSD(value);
    }
    else if (_.isBoolean(value)) {
      formattedValue = value && <CheckIcon color="secondary" />;
    }
    else if (_.isNumber(value)) {
      formattedValue = value.toString();
    }
    else {
      formattedValue = value || '';
    }

    return formattedValue;
  }

  getEmptyRowCount({ data, page, rowsPerPage } = this.state): number {
    return rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  }

  render() {
    const { classes, columnOrder, loading } = this.props;
    const { data, order, orderBy, page, rowsPerPage } = this.state;
    const emptyRows = loading ? rowsPerPage : this.getEmptyRowCount();

    return (
      <React.Fragment>
        <div className={classes.root}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <TableHead
              headers={columnOrder!.map(field => ({ id: field, label: field }))}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                <TableRow
                  columnOrder={columnOrder!}
                  data={row}
                  className={classes.row}
                  onClick={this.createRowClickHandler(row)}
                  key={row[this.idKey]}
                />
              ))}
              {!!emptyRows && (
                <TableRow colSpan={columnOrder!.length} rowSpan={emptyRows} />
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          classes={{
            root: classes.paginator
          }}
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

const styles: StyleRulesCallback<TableClassName> = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    minWidth: Math.min(1020, window.innerWidth)
  },
  row: {
    cursor: 'pointer'
  },
  logo: {
    maxWidth: 30,
    height: 'auto'
  },
  paginator: {
    backgroundColor: theme.palette.grey[200]
  }
});

export default withStyles(styles)(EnhancedTable) as ComponentType<ITableProps>;
