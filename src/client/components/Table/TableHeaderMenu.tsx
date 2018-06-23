import _ from 'lodash';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Nullable } from 'src/client/interfaces';

interface IMenuItem {
  label: string;
  action(): void;
}

export interface ITableHeaderMenuProps {
  header: string;
  items: IMenuItem[];
}

interface ITableHeaderMenuState {
  anchor: Nullable<MenuProps['anchorEl']>;
}

export default class TableHeaderMenu extends React.Component<ITableHeaderMenuProps, ITableHeaderMenuState> {
  state = {
    anchor: null
  };

  menuId = `table-header-menu-${_.kebabCase(this.props.header)}`;

  handleClick = event => {
    this.setState({ anchor: event.currentTarget });
  }

  close = event => {
    this.setState({ anchor: null });
  }

  getCloseHandler = (action: IMenuItem['action']) => event => {
    this.close(event);
    action();
  }

  render() {
    const { items } = this.props;
    const { anchor } = this.state;

    return (
      <React.Fragment>
        <IconButton
          aria-label="More"
          aria-owns={anchor ? this.menuId : ''}
          aria-haspopup="true"
          disabled={!items.length}
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id={this.menuId}
          anchorEl={anchor!}
          open={!!anchor}
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
