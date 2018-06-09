import _ from 'lodash/fp';
import React from 'react';
import TableCell, { SortDirection } from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import TableHeaderMenu, { ITableHeaderMenuProps } from './TableHeaderMenu';

interface ITableHeader {
  id: string;
  label: string;
  numeric?: boolean;
}

interface ITableHeadProps {
  headers: ITableHeader[];
  order: SortDirection;
  orderBy: string;
  onRequestSort(event, orderBy: string): void;
  options?: ITableHeaderMenuProps['items'];
}

export default class EnhancedTableHead extends React.Component<ITableHeadProps> {
  static defaultProps = {
    options: []
  };

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  }

  formatHeaderName: (headerName: string) => string = _.flow(
    _.words,
    _.map(_.capitalize),
    _.join(' ')
  );

  render() {
    const { headers, options, order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {headers.map(({ id, label, numeric = false }) => (
            <TableCell
              key={id}
              numeric={numeric}
              sortDirection={(orderBy === id && order) as SortDirection}
            >
              <div style={styles.header}>
                <Tooltip
                  title="Sort"
                  placement={numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={!!order && orderBy === id}
                    direction={order as Exclude<SortDirection, false>}
                    onClick={this.createSortHandler(id)}
                  >
                    {this.formatHeaderName(label)}
                  </TableSortLabel>
                </Tooltip>

                {!_.isEmpty(options) && (
                  <TableHeaderMenu
                    header={id}
                    items={options}
                  />
                )}
              </div>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};
