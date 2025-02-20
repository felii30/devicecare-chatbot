import React, { useState, useRef, useEffect } from "react"
import { Box, Flex } from "@chakra-ui/react"
import { WelcomeScreen } from "./WelcomeScreen.tsx"
import { ChatInterface } from "./ChatInterface.tsx"
import { Sidebar } from "./Sidebar.tsx"
import { Thread, Message } from "../types/chat.ts"
import { API_URL } from "../services/chatService"

export const ChatWindow: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<number | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)
  const [inputMessage, setInputMessage] = useState("")

  const activeThread = threads.find((t) => t.id === activeThreadId)
  const messages = activeThread?.messages || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleNewChat = () => {
    setActiveThreadId(undefined)
  }

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort()
      setIsLoading(false)
      setAbortController(null)
    }
  }

  const handleSendMessage = async (text: string) => {
    let threadId: number
    const apiThreadId = activeThreadId?.toString() || crypto.randomUUID()

    if (!activeThreadId) {
      threadId = Date.now()
      const newThread: Thread = {
        id: threadId,
        title: text.slice(0, 30) + "...",
        messages: [],
      }
      setThreads((prev) => [...prev, newThread])
      setActiveThreadId(threadId)
    } else {
      threadId = activeThreadId
    }

    const newMessage: Message = {
      id: Date.now(),
      text,
      isUser: true,
    }

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            title:
              thread.messages.length === 0
                ? text.slice(0, 30) + "..."
                : thread.title,
            messages: [...thread.messages, newMessage],
          }
        }
        return thread
      })
    )

    setIsLoading(true)
    const controller = new AbortController()
    setAbortController(controller)

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          thread_id: apiThreadId,
        }),
        signal: controller.signal,
      })

      const data = await response.json()
      const botResponse: Message = {
        id: Date.now() + 1,
        text: data.message,
        isUser: false,
      }

      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            return {
              ...thread,
              messages: [...thread.messages, botResponse],
            }
          }
          return thread
        })
      )
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request aborted")
      } else {
        console.error("Error:", error)
      }
    } finally {
      setIsLoading(false)
      setAbortController(null)
    }
  }

  return (
    <Flex h="100vh" overflow="hidden">
      <Sidebar
        threads={threads}
        onNewChat={handleNewChat}
        onSelectThread={setActiveThreadId}
        activeThreadId={activeThreadId}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Box
        flex="1"
        ml={{ base: 0, md: isSidebarOpen ? "260px" : 0 }}
        transition="margin-left 0.3s"
        position="relative"
        overflow="hidden"
        minW={0}
      >
        {!activeThreadId ? (
          <WelcomeScreen
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onStopGeneration={handleStopGeneration}
            onExampleClick={handleSendMessage}
          />
        ) : (
          <Flex direction="column" h="100%" minW={0}>
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onStopGeneration={handleStopGeneration}
              isSidebarOpen={isSidebarOpen}
              messagesEndRef={messagesEndRef}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
            />
          </Flex>
        )}
      </Box>
    </Flex>
  )
}
