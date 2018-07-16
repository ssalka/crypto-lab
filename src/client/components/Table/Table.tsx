import _ from 'lodash/fp';
import React, { Component, ComponentType, Fragment, ReactNode } from 'react';

import Table, { TableClassKey } from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { SortDirection } from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';

import { Omit } from 'src/client/interfaces';
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
  data: ICryptoAsset[];
  order: SortDirection;
  orderBy: string;
  page: number;
  rowsPerPage: number;
}

type TableProps = ITableProps & WithStyles<TableClassName>;

const [initialSortOrder, reverseSortOrder]: SortDirection[] = ['asc', 'desc'];

class EnhancedTable extends Component<TableProps, ITableState> {
  static defaultProps = {
    columnOrder: columns.defaultOrder
  };

  static initialState: Omit<ITableState, 'data'> = {
    order: initialSortOrder,
    orderBy: columns.numerical[0],
    page: 0,
    rowsPerPage: 25
  };

  idKey = 'name';

  state: ITableState = {
    ...EnhancedTable.initialState,
    data: _.sortBy<ICryptoAsset>(EnhancedTable.initialState.orderBy)(this.props.data)
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

  handleRequestSort = (event, orderBy: string) => {
    const reverseOrder = orderBy === this.state.orderBy && this.state.order === initialSortOrder;

    const order = reverseOrder ? reverseSortOrder : initialSortOrder;

    const sortItems: (items: ICryptoAsset[]) => ICryptoAsset[] = reverseOrder
      ? _.reverse
      : _.sortBy<ICryptoAsset>(orderBy);

    const data = sortItems(this.state.data);

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
      <Fragment>
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
      </Fragment>
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
