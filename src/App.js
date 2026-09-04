import { AppRouter } from "./Router";
import SocketBootstrap from "./SocketBootstrap";
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1447E6', //#2F3A62
    },
    secondary: {
      main: '#F9FAFB',
    },
    background: {
      default: '#F9FAFB',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppRouter />
        <SocketBootstrap />
      </ThemeProvider >
    </>

  );
}

export default App;
