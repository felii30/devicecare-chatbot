import React from "react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./theme/ThemeProvider.tsx"
import { ChatWindow } from "./components/ChatWindow.tsx"
import { ChakraProvider, Box } from "@chakra-ui/react"
import { chakraTheme } from "./theme/chakra-theme.ts"

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={chakraTheme}>
        <Box minH="100vh" overflow="hidden">
          <ThemeProvider>
            <ChatWindow />
          </ThemeProvider>
        </Box>
      </ChakraProvider>
    </BrowserRouter>
  )
}

export default App
