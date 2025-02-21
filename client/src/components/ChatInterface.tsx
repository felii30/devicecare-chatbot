/**
 * ChatInterface component handles the main chat interaction area.
 *
 * - Displays chat messages with user/bot indicators
 * - Handles message input and sending
 * - Shows loading states
 * - Manages scrolling behavior
 * - Responsive layout for mobile/desktop
 */

import React from "react"
import { Box, Flex } from "@chakra-ui/react"
import { ChatBubble } from "./ChatBubble.tsx"
import { MessageInput } from "./input/MessageInput.tsx"
import { Message } from "../types/chat.ts"
import { LoadingSkeleton } from "./LoadingSkeleton.tsx"

interface ChatInterfaceProps {
  /** Array of messages to display */
  messages: Message[]

  /** Loading state for API calls */
  isLoading: boolean

  /** Callback for sending messages */
  onSendMessage: (text: string) => void

  /** Callback to stop message generation */
  onStopGeneration: () => void

  /** Controls sidebar visibility */
  isSidebarOpen: boolean

  /** Ref for scrolling to bottom */
  messagesEndRef: React.RefObject<HTMLDivElement | null>

  /** Current input message value */
  inputMessage: string

  /** Callback to update input message */
  setInputMessage: (text: string) => void
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onStopGeneration,
  isSidebarOpen,
  messagesEndRef,
  inputMessage,
  setInputMessage,
}) => {
  return (
    <Flex
      direction="column"
      h="100%"
      minW={0}
      bg="white"
      position="relative"
      overflow="hidden"
      pt={{ base: "60px", md: 0 }}
      pb={{ base: "0", md: 0 }}
    >
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />
      <InputContainer
        isSidebarOpen={isSidebarOpen}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        onStopGeneration={onStopGeneration}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
      />
    </Flex>
  )
}

/**
 * Displays the list of chat messages with scroll behavior
 */
const ChatMessages: React.FC<{
  messages: Message[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}> = ({ messages, isLoading, messagesEndRef }) => (
  <Box
    flex="1"
    overflowY="auto"
    px={{ base: 2, md: 6 }}
    pb={{ base: "20px", md: "40px" }}
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
    <Box maxW="4xl" mx="auto" py={{ base: 3, md: 4 }} px={{ base: 2, md: 0 }}>
      {messages.map((message, index) => (
        <ChatBubble
          key={message.id}
          message={message.text}
          isUser={message.isUser}
          isLoading={
            !message.isUser && index === messages.length - 1 && isLoading
          }
        />
      ))}
      {isLoading && messages.length === 0 && <LoadingSkeleton />}
      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].isUser && <LoadingSkeleton />}
      <div ref={messagesEndRef} />
    </Box>
  </Box>
)

/**
 * Container for the message input area
 */
const InputContainer: React.FC<{
  isSidebarOpen: boolean
  onSendMessage: (text: string) => void
  isLoading: boolean
  onStopGeneration: () => void
  inputMessage: string
  setInputMessage: (text: string) => void
}> = ({
  isSidebarOpen,
  onSendMessage,
  isLoading,
  onStopGeneration,
  inputMessage,
  setInputMessage,
}) => (
  <Box
    borderTop="1px"
    borderColor="gray.200"
    bg="white"
    px={{ base: 2, md: 6 }}
    py={{ base: 2, md: 4 }}
    zIndex={2}
  >
    <Box maxW="4xl" mx="auto">
      <MessageInput
        value={inputMessage || ""}
        onChange={setInputMessage}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        onStopGeneration={onStopGeneration}
      />
    </Box>
  </Box>
)
