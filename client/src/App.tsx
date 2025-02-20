import React from "react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./theme/ThemeProvider.tsx"
import { ChatWindow } from "./components/ChatWindow.tsx"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ChatWindow />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
