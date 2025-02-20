import React, { type ReactNode } from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { chakraTheme } from "./chakra-theme.ts"

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>
}
