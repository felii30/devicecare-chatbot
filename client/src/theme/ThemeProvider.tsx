import React, { type ReactNode } from "react"
import { ChakraProvider } from "@chakra-ui/react"

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <ChakraProvider>{children}</ChakraProvider>
}
