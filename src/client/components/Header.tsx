import React, { SFC } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

interface IAppHeaderProps {
  title: string;
}

const Header: SFC<IAppHeaderProps> = ({ title }) => (
  <AppBar position="sticky" color="primary">
     <Toolbar>
       <Typography variant="title" color="inherit">
         {title}
       </Typography>
     </Toolbar>
   </AppBar>
);

export default Header;
