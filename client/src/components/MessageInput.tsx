import React, { useState, useRef, useEffect } from "react"
import { Textarea, IconButton, Flex, Box } from "@chakra-ui/react"
import { ArrowUpIcon, SmallCloseIcon } from "@chakra-ui/icons"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  onStopGeneration?: () => void
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading = false,
  onStopGeneration,
}) => {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea up to maxHeight
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const newHeight = Math.min(textarea.scrollHeight, 150) // Max height of 200px
      textarea.style.height = `${newHeight}px`
    }
  }, [message])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim() && !isLoading) {
      e.preventDefault()
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (message.trim() && !isLoading) {
          onSendMessage(message)
          setMessage("")
        }
      }}
    >
      <Flex gap={3} align="center">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          minH={{ base: "45px", sm: "50px", md: "50px" }}
          maxH={{ base: "120px", sm: "150px", md: "150px" }}
          h="auto"
          overflowY="auto"
          resize="none"
          bg="white"
          border="1px"
          borderColor="gray.200"
          borderRadius="15px"
          _hover={{ borderColor: "gray.300" }}
          _focus={{
            borderColor: "brand.500",
            boxShadow: "none",
          }}
          py={{ base: 2, sm: 3, md: 3 }}
          px={{ base: 3, sm: 3, md: 3 }}
          rows={1}
          flex="1"
          fontSize={{ base: "sm", sm: "md", md: "md" }}
          textAlign="left"
          lineHeight={{ base: "1.5", sm: "1.5", md: "1.5" }}
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
              borderRadius: "8px",
              backgroundColor: `rgba(0, 0, 0, 0.05)`,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: `rgba(0, 0, 0, 0.1)`,
              borderRadius: "8px",
            },
            "&:focus::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::placeholder": {
              textAlign: "left",
              lineHeight: "inherit",
            },
          }}
        />
        <IconButton
          size="sm"
          colorScheme={isLoading ? "gray" : "brand"}
          aria-label={isLoading ? "Stop generation" : "Send message"}
          icon={isLoading ? <SmallCloseIcon /> : <ArrowUpIcon />}
          onClick={isLoading ? onStopGeneration : undefined}
          type={isLoading ? "button" : "submit"}
          isDisabled={!isLoading && !message.trim()}
        />
      </Flex>
    </form>
  )
}
