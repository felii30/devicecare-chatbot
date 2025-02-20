import { extendTheme } from '@chakra-ui/react';

export const chakraTheme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: "Inter, -apple-system, system-ui, sans-serif",
    body: "Inter, -apple-system, system-ui, sans-serif",
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: "600",
        letterSpacing: "-0.02em",
      },
    },
    Text: {
      baseStyle: {
        letterSpacing: "-0.01em",
      },
    },
  },
  colors: {
    brand: {
      50: '#e0f7ff',
      100: '#b8ecff',
      200: '#7ddeff',
      400: '#00b1d7',
      500: '#0098c1',
      600: '#007ba1',
    },
    accent: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
    },
    blue: {
      50: '#ebf8ff',
      100: '#bee3f8',
      200: '#90cdf4',
      300: '#63b3ed',
      400: '#4299e1',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      700: '#374151',
      800: '#1f2937',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
      },
      'html, body': {
        height: '100%',
        overflow: 'hidden',
      },
    },
  },
}); 