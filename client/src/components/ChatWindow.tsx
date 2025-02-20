import React, { useState, useRef, useEffect } from "react"
import { keyframes } from "@emotion/react"
import {
  VStack,
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  Button,
} from "@chakra-ui/react"
import { ChatBubble } from "./ChatBubble.tsx"
import { MessageInput } from "./MessageInput.tsx"
import { Sidebar } from "./Sidebar.tsx"

// Define gradient animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`

interface Message {
  id: number
  text: string
  isUser: boolean
}

interface Thread {
  id: number
  title: string
  messages: Message[]
}

const EXAMPLE_PROMPTS = [
  "What services does DeviceCare offer?",
  "How do I perform a device health scan?",
  "Do you offer a free trial?",
  "Can you help with device protection?",
]

export const ChatWindow: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<number | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)

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
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
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

  const handleExampleClick = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const showWelcomeScreen = threads.length === 0

  return (
    <Flex h="100vh">
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
        ml={isSidebarOpen ? "260px" : 0}
        transition="margin-left 0.3s"
      >
        {!activeThreadId ? (
          <Flex
            minH="100vh"
            direction="column"
            bg="white"
            position="relative"
            overflow="hidden"
          >
            {/* Gradient Blobs */}
            <Box
              position="absolute"
              top="10%"
              left="15%"
              width="40vw"
              height="40vw"
              background="radial-gradient(circle, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0) 70%)"
              borderRadius="full"
              filter="blur(40px)"
              zIndex={0}
            />
            <Box
              position="absolute"
              top="40%"
              right="15%"
              width="35vw"
              height="35vw"
              background="radial-gradient(circle, rgba(167,139,250,0.08) 0%, rgba(167,139,250,0) 70%)"
              borderRadius="full"
              filter="blur(40px)"
              zIndex={0}
            />
            <Box
              position="absolute"
              top="60%"
              left="25%"
              width="30vw"
              height="30vw"
              background="radial-gradient(circle, rgba(216,180,254,0.08) 0%, rgba(216,180,254,0) 70%)"
              borderRadius="full"
              filter="blur(40px)"
              zIndex={0}
            />

            {/* Content */}
            <Flex
              flex="1"
              direction="column"
              align="center"
              justify="center"
              px={4}
              position="relative"
              zIndex={1}
            >
              <Box textAlign="center" mb={12}>
                <Heading
                  size="lg"
                  mb={4}
                  bgGradient="linear(to-r, brand.500, blue.400)"
                  bgClip="text"
                  fontSize="4xl"
                >
                  Hi there! 👋
                </Heading>
                <Text color="gray.600" mb={8} fontSize="lg">
                  How can I help you with DeviceCare today?
                </Text>
              </Box>

              <Box w="100%" maxW="2xl">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onStopGeneration={handleStopGeneration}
                />
                <Box mt={8}>
                  <Text color="gray.500" mb={4} fontSize="sm">
                    Or try one of these examples:
                  </Text>
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(2, 1fr)",
                    }}
                    gap={3}
                  >
                    {EXAMPLE_PROMPTS.map((prompt) => (
                      <Button
                        key={prompt}
                        onClick={() => handleExampleClick(prompt)}
                        variant="outline"
                        justifyContent="flex-start"
                        py={6}
                        px={4}
                        height="auto"
                        whiteSpace="normal"
                        textAlign="left"
                        borderColor="gray.200"
                        bg="white"
                        _hover={{
                          bg: "gray.50",
                          borderColor: "brand.200",
                        }}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Flex>
          </Flex>
        ) : (
          <Flex
            flex="1"
            direction="column"
            bg="white"
            h="100vh"
            position="relative"
          >
            <Box flex="1" overflowY="auto" px={4} pb={24}>
              <Box maxW="4xl" mx="auto" py={4}>
                {messages.map((message, index) => (
                  <ChatBubble
                    key={message.id}
                    message={message.text}
                    isUser={message.isUser}
                    isLoading={
                      !message.isUser &&
                      index === messages.length - 1 &&
                      isLoading
                    }
                  />
                ))}
                <div ref={messagesEndRef} />
              </Box>
            </Box>
            <Box
              position="fixed"
              bottom={0}
              left={isSidebarOpen ? "260px" : 0}
              right={0}
              borderTop="1px"
              borderColor="gray.200"
              bg="white"
              p={4}
              transition="left 0.3s"
            >
              <Box maxW="4xl" mx="auto">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onStopGeneration={handleStopGeneration}
                />
              </Box>
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}
