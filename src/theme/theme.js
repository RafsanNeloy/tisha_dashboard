import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#63a4ff',
      dark: '#004ba0',
    },
    secondary: {
      main: '#00bcd4',
      light: '#62efff',
      dark: '#008ba3',
    },
    background: {
      default: '#f8faff',
      paper: '#ffffff',
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `
            linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(0, 188, 212, 0.1)),
            radial-gradient(circle at top right, rgba(25, 118, 210, 0.15), transparent 400px),
            radial-gradient(circle at bottom left, rgba(0, 188, 212, 0.15), transparent 400px),
            linear-gradient(to right, #ffffff, #f8faff)
          `,
          minHeight: '100vh',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              url('/plastic-pattern.png') center/300px repeat,
              linear-gradient(120deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))
            `,
            opacity: 0.1,
            zIndex: -1,
            pointerEvents: 'none'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
          borderRadius: 8
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 4
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4
          }
        }
      }
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.5px'
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.25px'
    },
    h3: {
      fontWeight: 600
    },
    button: {
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 16
  }
}); 