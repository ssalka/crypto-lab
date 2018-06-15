import _ from 'lodash/fp';
import React, { HTMLProps, ReactNode } from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';

import { FieldName } from 'src/client/interfaces';
import { formatUSD } from 'src/client/utils';
import * as columns from './columns';

interface ITableRowProps extends Pick<HTMLProps<HTMLTableRowElement>, 'className' | 'onClick'> {
  columnOrder: FieldName[];
  data: Record<string, any>;
}

// TODO: upgrade to TS 2.9, make component generic w/ conditional empty type
interface IEmptyTableRowProps {
  colSpan?: number;
  rowSpan?: number;
}

type TableRowProps = ITableRowProps | IEmptyTableRowProps;

class EnhancedTableRow extends React.Component<TableRowProps> {
  formatCellValue(value: any, key: FieldName): ReactNode {
    let formattedValue: ReactNode;

    if (_.isArray(value)) {
      formattedValue = _.has('url', value[0])
        ? <img src={value[0].url} style={styles.logo} />
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

  isEmpty(props: TableRowProps = this.props): props is IEmptyTableRowProps {
    const { data, columnOrder } = props as ITableRowProps;

    return _.isEmpty(data || columnOrder);
  }

  render() {
    if (this.isEmpty()) {
      const { colSpan, rowSpan } = this.props as IEmptyTableRowProps;

      return (
        <TableRow style={styles.emptyRows(rowSpan)}>
          <TableCell colSpan={colSpan} />
        </TableRow>
      );
    }

    const { className, columnOrder, data, onClick } = this.props as (ITableRowProps & HTMLProps<any>);
    const [firstField, ...otherFields] = columnOrder;

    return (
      <TableRow className={className} hover={true} onClick={onClick}>
        <TableCell component="th" scope="row">
          {this.formatCellValue(data[firstField], firstField)}
        </TableCell>
        {otherFields.map(field => (
          <TableCell key={field}>{this.formatCellValue(data[field], field)}</TableCell>
        ))}
      </TableRow>
    );
  }
}

const styles = {
  logo: {
    maxWidth: 30,
    height: 'auto'
  },
  emptyRows(rowSpan: number) {
    return {
      height: 49 * rowSpan
    };
  }
};

export default EnhancedTableRow;
