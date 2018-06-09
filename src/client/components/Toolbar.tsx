import React, { SFC } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const toolbarStyles = theme => ({
  root: {
    flex: '0 0 auto'
  }
});

type TableToolbarClassNames = 'root' | 'highlight' | 'title' | 'spacer' | 'actions';

interface ITableToolbarProps {
  title: string;
}

const EnhancedTableToolbar: SFC<
  ITableToolbarProps & WithStyles<TableToolbarClassNames>
> = ({ classes, title }) => (
  <Toolbar className={classes.root}>
    <Typography variant="title">
      {title}
    </Typography>
  </Toolbar>
);

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
