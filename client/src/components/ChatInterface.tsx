import React, { useRef } from "react"
import { Box, Flex } from "@chakra-ui/react"
import { ChatBubble } from "./ChatBubble.tsx"
import { MessageInput } from "./MessageInput.tsx"
import { Message } from "../types/chat.ts"

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (text: string) => void
  onStopGeneration: () => void
  isSidebarOpen: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onStopGeneration,
  isSidebarOpen,
  messagesEndRef,
}) => {
  return (
    <Flex
      flex="1"
      direction="column"
      bg="white"
      h="100vh"
      position="relative"
      overflow="hidden"
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
      />
    </Flex>
  )
}

const ChatMessages: React.FC<{
  messages: Message[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}> = ({ messages, isLoading, messagesEndRef }) => (
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
      <div ref={messagesEndRef} />
    </Box>
  </Box>
)

const InputContainer: React.FC<{
  isSidebarOpen: boolean
  onSendMessage: (text: string) => void
  isLoading: boolean
  onStopGeneration: () => void
}> = ({ isSidebarOpen, onSendMessage, isLoading, onStopGeneration }) => (
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
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        onStopGeneration={onStopGeneration}
      />
    </Box>
  </Box>
)
