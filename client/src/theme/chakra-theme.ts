import { extendTheme } from '@chakra-ui/react';

export const chakraTheme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#f3e8ff',
      100: '#e4ccff',
      200: '#c8a3ff',
      500: '#8b5cf6',
      600: '#7c3aed',
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
    },
  },
}); 