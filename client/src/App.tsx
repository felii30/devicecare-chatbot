import React from "react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./theme/ThemeProvider.tsx"
import { Box, Container, Heading } from "@chakra-ui/react"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Container maxW="container.xl">
          <Box py={8}>
            <Heading>Welcome to Your App</Heading>
          </Box>
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
