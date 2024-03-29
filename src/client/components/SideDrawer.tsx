import classNames from 'classnames';
import React, { Component, ComponentType } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Checkbox from '@material-ui/core/Checkbox';
import Drawer, { DrawerClassKey, DrawerProps } from '@material-ui/core/Drawer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';
import MoneyIcon from '@material-ui/icons/MonetizationOn';
import TableIcon from '@material-ui/icons/List';

import { IView, ViewName, ViewType } from 'src/client/interfaces';
import { compose } from 'src/client/utils';

interface ISideDrawerProps extends Pick<DrawerProps, 'open' | 'onClose'> {
  selectedView: IView;
}

interface ISideDrawerState {
  permanent: boolean;
}

class SideDrawer extends Component<SideDrawer.Props, ISideDrawerState> {
  state: ISideDrawerState = {
    permanent: __DEV__
  };

  toggleDrawerVariant = event => this.setState(state => {
    if (this.props.open && state.permanent && this.props.onClose) {
      this.props.onClose(event);
    }

    return {
      permanent: !state.permanent
    };
  })

  createClickHandler(name: ViewName, type: ViewType = ViewType.Table) {
    return () => this.props.history.push('/' + name.toLowerCase());
  }

  render() {
    const { classes, open, onClose, selectedView } = this.props;
    const { permanent } = this.state;

    return (
      <Drawer
        open={open}
        onClose={onClose}
        variant={permanent ? 'permanent' : 'temporary'}
        classes={{
          paper: classNames(classes.paper, {
            [classes.closed]: !open,
            [classes.permanent]: !permanent
          })
        }}
      >
        <List>
          <ListItem
            button={true}
            onClick={this.createClickHandler(ViewName.Coins)}
          >
            <ListItemIcon>
              <MoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Coins" />
          </ListItem>
          {open && (
            <List component="div" disablePadding={true}>
              <ListItem
                button={true}
                dense={true}
                onClick={this.createClickHandler(ViewName.Coins)}
                className={classes.nested}
              >
                <ListItemIcon
                  className={classNames({
                    [classes.selected]: selectedView.type === ViewType.Table
                  })}
                >
                  <TableIcon />
                </ListItemIcon>
                <ListItemText
                  inset={true}
                  primary="Table View"
                />
              </ListItem>
            </List>
          )}
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

namespace SideDrawer {
  type Classes = Extract<DrawerClassKey, 'paper'> | 'permanent' | 'closed' | 'keepVisible' | 'nested' | 'selected';

  export type Props = ISideDrawerProps & RouteComponentProps<{}> & WithStyles<Classes>;

  const width = 240;

  export const styles: StyleRulesCallback<Classes> = theme => ({
    paper: {
      width,
      position: 'relative',
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
      maxWidth: width
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
    },
    nested: {
      paddingLeft: 4 * theme.spacing.unit
    },
    selected: {
      color: theme.palette.primary.main
    }
  });
}

export default compose(
  withStyles(SideDrawer.styles),
  withRouter
)(SideDrawer) as ComponentType<ISideDrawerProps>;
