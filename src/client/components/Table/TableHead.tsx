import _ from 'lodash/fp';
import React from 'react';
import TableCell, { SortDirection } from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

interface ITableHeader {
  id: string;
  label: string;
  numeric: boolean;
}

interface ITableHeadProps {
  headers: ITableHeader[];
  order: SortDirection;
  orderBy: string;
  onRequestSort(event, orderBy: string): void;
}

export default class EnhancedTableHead extends React.Component<ITableHeadProps> {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  }

  formatFieldName: (fieldName: string) => string = _.flow(
    _.words,
    _.map(_.capitalize),
    _.join(' ')
  );

  render() {
    const { headers, order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {headers.map(({ id, numeric, label }) => (
            <TableCell
              key={id}
              numeric={numeric}
              sortDirection={(orderBy === id && order) as SortDirection}
            >
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
                  {this.formatFieldName(label)}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}
