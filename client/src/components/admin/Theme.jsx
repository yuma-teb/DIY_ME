import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#D0B8AC',
    },
    secondary: {
      main: '#F3D8C7',
    },
    background: {
      default: '#F7F7F7',
    },
    error: {
      main: '#f04438',
    },
    success: {
      main: '#0D894F',
    },
    view: {
      main: '#1877F2',
    },
    nonAction: {
      main: '#808080',
    },
  },
  typography: {
    h1: {
      fontSize: 40,
      fontWeight: 700,
    },
    h2: {
      fontSize: 24,
      fontWeight: 600,
    },
    h3: {
      fontSize: 20,
      fontWeight: 500,
    },
    body1: {
      fontSize: 18,
    },
    body2: {
      fontSize: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: 700,
    },
    subTitile: {
      fontSize: 24,
      fontWeight: 600,
    },
    section: {
      fontSize: 20,
      fontWeight: 500,
    },
    text: {
      fontSize: 16,
      fontWeight: 400,
    }
  },
  // components: {
  //   MuiInputBase: {
  //     styleOverrides: {
  //       input: {
  //         height: 28,
  //       },
  //     },
  //   },
  // },
});
