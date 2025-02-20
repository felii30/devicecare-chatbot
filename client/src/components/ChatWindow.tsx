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

// Add these keyframes at the top with other animations
const floatAnimation1 = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-40px, 30px) rotate(3deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`

const floatAnimation2 = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(35px, -30px) rotate(-3deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`

const floatAnimation3 = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-30px, -35px) rotate(2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`

// Add these new animations at the top with other keyframes
const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

const gradientMove = keyframes`
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
        ml={{
          base: isSidebarOpen ? "260px" : 0,
          md: isSidebarOpen ? "260px" : 0,
        }}
        transition="margin-left 0.3s"
        position="relative"
        left={0}
        transform={{
          base: isSidebarOpen ? "translateX(0)" : "translateX(0)",
          md: "none",
        }}
        overflow="hidden"
      >
        {!activeThreadId ? (
          <Flex
            minH="100vh"
            direction="column"
            bg="white"
            position="relative"
            overflow="hidden"
            px={{ base: 4, md: 6 }}
          >
            {/* Gradient Blobs */}
            <Box
              position="absolute"
              top="10%"
              left="15%"
              width={{ base: "60vw", md: "40vw" }}
              height={{ base: "60vw", md: "40vw" }}
              background="radial-gradient(circle, rgba(0,177,215,0.15) 0%, rgba(0,177,215,0) 70%)"
              borderRadius="full"
              filter="blur(40px)"
              zIndex={0}
              animation={`${floatAnimation1} 18s ease-in-out infinite`}
              sx={{ transformOrigin: "center center" }}
            />
            <Box
              position="absolute"
              top={{ base: "30%", md: "40%" }}
              right="15%"
              width={{ base: "50vw", md: "35vw" }}
              height={{ base: "50vw", md: "35vw" }}
              background="radial-gradient(circle, rgba(52,211,153,0.15) 0%, rgba(52,211,153,0) 70%)"
              borderRadius="full"
              filter="blur(40px)"
              zIndex={0}
              animation={`${floatAnimation2} 20s ease-in-out infinite`}
              sx={{ transformOrigin: "center center" }}
            />
            <Box
              position="absolute"
              top={{ base: "50%", md: "60%" }}
              left="25%"
              width={{ base: "45vw", md: "30vw" }}
              height={{ base: "45vw", md: "30vw" }}
              background="radial-gradient(circle, rgba(0,152,193,0.15) 0%, rgba(0,152,193,0) 70%)"
              borderRadius="full"
              filter="blur(40px)"
              zIndex={0}
              animation={`${floatAnimation3} 15s ease-in-out infinite`}
              sx={{ transformOrigin: "center center" }}
            />

            {/* Content */}
            <Flex
              flex="1"
              direction="column"
              align="center"
              justify="center"
              position="relative"
              zIndex={1}
            >
              <Box textAlign="center" mb={12} px={{ base: 4, md: 0 }}>
                <Heading
                  size={{ base: "xl", md: "lg" }}
                  mb={4}
                  bgGradient="linear(to-r, brand.500, accent.100, brand.600)"
                  bgClip="text"
                  fontSize="4xl"
                  bgSize="200% auto"
                  animation={`
                    ${fadeIn} 1.3s ease-out forwards,
                    ${gradientMove} 7s linear infinite
                  `}
                >
                  Hi there!
                </Heading>
                <Text
                  color="gray.600"
                  mb={8}
                  fontSize={{ base: "md", md: "lg" }}
                  animation={`${fadeIn} 0.6s ease-out forwards`}
                  opacity="0"
                >
                  How can I help you with DeviceCare today?
                </Text>
              </Box>

              <Box w="100%" maxW="2xl" px={{ base: 2, md: 0 }}>
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onStopGeneration={handleStopGeneration}
                />
                <Box mt={8}>
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      sm: "repeat(2, 1fr)",
                    }}
                    gap={{ base: 2, md: 3 }}
                  >
                    {EXAMPLE_PROMPTS.map((prompt) => (
                      <Button
                        key={prompt}
                        onClick={() => handleExampleClick(prompt)}
                        variant="outline"
                        justifyContent="flex-start"
                        py={{ base: 4, md: 6 }}
                        px={{ base: 3, md: 4 }}
                        height="auto"
                        whiteSpace="normal"
                        textAlign="left"
                        borderColor="gray.200"
                        bg="white"
                        _hover={{
                          bg: "gray.50",
                          borderColor: "brand.500",
                        }}
                        fontSize={{ base: "sm", md: "md" }}
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
            overflow="hidden"
          >
            <Box
              flex="1"
              overflowY="auto"
              px={{ base: 4, md: 6 }}
              pb={{ base: 24, md: 24 }}
              sx={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  border: "2px solid transparent",
                  backgroundClip: "content-box",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                },
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0, 0, 0, 0.1) transparent",
              }}
            >
              <Box
                maxW="4xl"
                mx="auto"
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 0 }}
              >
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
              left={isSidebarOpen ? { base: "260px", md: "260px" } : 0}
              right={0}
              borderTop="1px"
              borderColor="gray.200"
              bg="white"
              px={{ base: 4, md: 6 }}
              py={{ base: 3, md: 4 }}
              transition="left 0.3s"
            >
              <Box maxW="4xl" mx="auto" px={{ base: 2, md: 0 }}>
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
