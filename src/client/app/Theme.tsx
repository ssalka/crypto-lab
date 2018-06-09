import React, { ReactElement } from 'react';
import { PaletteType } from '@material-ui/core';
import { red, green, blue } from '@material-ui/core/colors';
import createMuiTheme, { Theme as ITheme } from '@material-ui/core/styles/createMuiTheme';
import createPalette, { PaletteOptions } from '@material-ui/core/styles/createPalette';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

interface IThemeProps {
  type: PaletteType;
}

interface IThemeState extends IThemeProps {
  theme: ITheme;
}

class Theme extends React.Component<IThemeProps, IThemeState> {
  static getDerivedStateFromProps({ type }, prevState) {
    if (type === prevState.type) {
      return null;
    }
    else {
      return {
        type,
        theme: Theme[type]
      };
    }
  }

  componentDidMount() {
    // TODO: add Sass
    document.body.style.overflow = 'hidden';
  }

  state: IThemeState = {
    theme: Theme[this.props.type],
    type: this.props.type
  };

  render() {
    return (
      <MuiThemeProvider theme={this.state.theme}>
        <CssBaseline children={this.props.children as ReactElement<any>} />
      </MuiThemeProvider>
    );
  }
}

namespace Theme {
  export const light = createTheme('light', {
    primary: blue,
    secondary: {
      main: green[400]
    }
  });

  export const dark = createTheme('dark', {
    primary: {
      main: blue[900]
    },
    secondary: {
      main: green[400]
    }
  });

  const defaultPaletteOptions = {
    error: red
  };

  function createTheme(type: PaletteType, paletteOptions: PaletteOptions): ITheme {
    return createMuiTheme({
      palette: createPalette({
        type,
        ...defaultPaletteOptions,
        ...paletteOptions
      })
    });
  }
}

export default Theme;
