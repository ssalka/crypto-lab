import _ from 'lodash';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';

interface IMenuItem {
  label: string;
  action(): void;
}

export interface ITableHeaderMenuProps {
  header: string;
  items: IMenuItem[];
}

type TableHeaderMenuState = Pick<MenuProps, 'anchorEl'>;

export default class TableHeaderMenu extends React.Component<ITableHeaderMenuProps, TableHeaderMenuState> {
  state = {
    anchorEl: null
  };

  menuId = `table-header-menu-${_.kebabCase(this.props.header)}`;

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  close = event => {
    this.setState({ anchorEl: null });
  }

  getCloseHandler = (action: IMenuItem['action']) => event => {
    this.close(event);
    action();
  }

  render() {
    const { items } = this.props;
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? this.menuId : null}
          aria-haspopup="true"
          disabled={!items.length}
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id={this.menuId}
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={this.close}
        >
          {items.map(({ label, action }) => (
            <MenuItem key={label} selected={label === 'Test Button'} onClick={this.getCloseHandler(action)}>
              {label}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
}
