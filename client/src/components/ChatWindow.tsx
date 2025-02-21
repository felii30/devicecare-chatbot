/**
 * Main chat window component that manages the chat interface and thread state.
 * Handles message sending, thread management, and UI state.
 *
 * Features:
 * - Manages chat threads and active thread state
 * - Handles message sending and receiving
 * - Controls loading states and abort functionality
 * - Manages sidebar visibility
 * - Handles message scrolling
 */

import React, { useState, useRef, useEffect } from "react"
import { Box, Flex } from "@chakra-ui/react"
import { WelcomeScreen } from "./WelcomeScreen.tsx"
import { ChatInterface } from "./ChatInterface.tsx"
import { Sidebar } from "./Sidebar.tsx"
import { Thread, Message } from "../types/chat.ts"
import { API_URL } from "../services/chatService.ts"

export const ChatWindow: React.FC = () => {
  // State management for chat threads and UI
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<number | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState("")

  // Refs for scroll management and API control
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)

  // Get the active thread's messages
  const activeThread = threads.find((t) => t.id === activeThreadId)
  const messages = activeThread?.messages || []

  /**
   * Scrolls to the bottom of the chat window
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  /**
   * Starts a new chat thread
   */
  const handleNewChat = () => {
    setActiveThreadId(undefined)
  }

  /**
   * Stops the current message generation
   */
  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort()
      setIsLoading(false)
      setAbortController(null)
    }
  }

  /**
   * Sends a message and handles the response
   * @param text - The message to send
   */
  const handleSendMessage = async (text: string) => {
    let threadId: number
    const apiThreadId = activeThreadId?.toString() || crypto.randomUUID()

    // Create new thread if none active
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

    // Add user message to thread
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

    // Handle API request
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

      // Add bot response to thread
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
