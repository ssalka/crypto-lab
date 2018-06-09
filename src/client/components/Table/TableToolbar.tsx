import React, { SFC } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight: theme.palette.type === 'light' ? {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  } : {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.secondary.dark,
  },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
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
    <div className={classes.title}>
      <Typography variant="title" id="tableTitle">
        {title}
      </Typography>
    </div>
  </Toolbar>
);

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
