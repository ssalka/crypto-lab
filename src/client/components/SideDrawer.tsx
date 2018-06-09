import classNames from 'classnames';
import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import Drawer, { DrawerClassKey, DrawerProps } from '@material-ui/core/Drawer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';
import MoneyIcon from '@material-ui/icons/MonetizationOn';

type SideDrawerClassName = Extract<DrawerClassKey, 'paper'> | 'permanent' | 'closed' | 'keepVisible';

type SideDrawerProps = Pick<DrawerProps, 'open' | 'onClose'> & WithStyles<SideDrawerClassName>;

interface ISideDrawerState {
  permanent: boolean;
}

class SideDrawer extends React.Component<SideDrawerProps, ISideDrawerState> {
  state: ISideDrawerState = {
    permanent: false
  };

  toggleDrawerVariant = event => this.setState(state => {
    if (this.props.open && state.permanent) {
      this.props.onClose(event);
    }

    return {
      permanent: !state.permanent
    };
  })

  render() {
    const { classes, open, ...props } = this.props;
    const { permanent } = this.state;

    return (
      <Drawer
        {...props}
        open={open}
        variant={permanent ? 'permanent' : 'temporary'}
        classes={{
          paper: classNames(classes.paper, {
            [classes.closed]: !open,
            [classes.permanent]: !permanent
          })
        }}
      >
        <List>
          <ListItem button={true}>
            <ListItemIcon>
              <MoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Coins" />
          </ListItem>
        </List>

        {open && (
          <FormControlLabel
            className={classes.keepVisible}
            label="Keep Visible"
            control={(
              <Checkbox
                checked={this.state.permanent}
                onChange={this.toggleDrawerVariant}
                value="permanent"
              />
            )}
          />
        )}
      </Drawer>
    );
  }
}

const drawerWidth = 240;

const styles: StyleRulesCallback<SideDrawerClassName> = theme => ({
  paper: {
    position: 'relative',
    width: drawerWidth,
    whiteSpace: 'nowrap',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 1,
    maxHeight: '100%',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  permanent: {
    maxWidth: drawerWidth
  },
  closed: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  keepVisible: {
    margin: theme.spacing.unit
  }
});

export default withStyles(styles)(SideDrawer);
