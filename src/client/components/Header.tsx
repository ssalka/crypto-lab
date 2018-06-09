import React, { SFC } from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles, WithStyles } from '@material-ui/core/styles';

interface IAppHeaderProps {
  title: string;
  onMenuToggle: IconButtonProps['onClick'];
  menuOpen?: boolean;
}

type HeaderProps = IAppHeaderProps & WithStyles<'menuIcon'>;

const Header: SFC<HeaderProps> = ({ classes, title, onMenuToggle, menuOpen = false }) => (
  <AppBar position="sticky" color="primary">
    <Toolbar disableGutters={true}>
      <IconButton
        className={classes.menuIcon}
        color="inherit"
        aria-label="open drawer"
        onClick={onMenuToggle}
      >
        <MenuIcon />
      </IconButton>
       <Typography variant="title" color="inherit">
         {title}
       </Typography>
    </Toolbar>
   </AppBar>
);

const styles = theme => ({
  menuIcon: {
    marginLeft: 12,
    marginRight: 20
  }
});

export default withStyles(styles)(Header);
