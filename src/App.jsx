import AppRoutes from './routes';
import { createTheme, MantineProvider, virtualColor, Title, Button, Badge, Card, Anchor } from '@mantine/core';
import 'dayjs/locale/pt-br';
import '@mantine/core/styles.css';

const theme = createTheme({
  defaultRadius: 'md',
  fontFamily: 'Google Sans Flex, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'monospace',
  headings: { fontFamily: 'Google Sans Flex, Helvetica, Arial, sans-serif' },
  colors: {
    primary: virtualColor({
      name: 'primary',
      dark: 'gray',
      light: 'dark',
    }),
    secondary: virtualColor({
      name: 'secondary',
      dark: 'white',
      light: 'gray',
    }),
    'mublin-color': [
      '#e0fff8',
      '#c2fef0',
      '#85fde5',
      '#47fcd9',
      '#1ffbcd',
      '#00f5d4',
      '#00d4b8',
      '#00b8a0',
      '#008070',
      '#004d43',
    ],
    geminiGray: [
      "#f5f5f5", // 0
      "#e0e0e0", // 1
      "#bdbebf", // 2
      "#98999b", // 3
      "#737578", // 4
      "#4e5154", // 5
      "#292d32", // 6
      "#1e1e1f", // 7 (Card background)
      "#131314", // 8 (Body background)
      "#0b0b0c", // 9
    ],
  },
  primaryColor: 'mublin-color', // sua cor principal atual
  forceColorScheme: 'dark', // se quiser forçar o dark mode
  components: {
    Title: Title.extend({
      defaultProps: {
        c: 'white',
      },
    }),
    Button: Button.extend({
      defaultProps: {
        fw: '550',
        radius: 'md',
        variant: "filled"
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        fw: 'normal'
      },
    }),
    Card: Card.extend({
      defaultProps: {
        withBorder: true, // Precisamos da borda ativa para que a cor apareça
      },
      styles: (theme, props) => ({
        root: {
          borderColor: props['data-active'] === 'true'
            ? '#00f5d4' 
            : '#25292d', 
          transition: 'border-color 200ms ease',
          borderWidth: 1,
          borderStyle: 'solid',
        },
      }),
    }),
    Anchor: Anchor.extend({
      defaultProps: {
        c: 'white'
      },
    }),
  },
})

function App() {

  return (
    <>
      <MantineProvider theme={theme} forceColorScheme='dark'>
        <AppRoutes />
      </MantineProvider>
    </>
  )
}

export default App
