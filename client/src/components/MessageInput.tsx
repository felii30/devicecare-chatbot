import React, { useState, useRef, useEffect } from "react"
import { Textarea, IconButton, Flex, Box, Icon } from "@chakra-ui/react"
import { ArrowUpIcon, SmallCloseIcon } from "@chakra-ui/icons"
import AudioRecorder from "./AudioRecorder.tsx"

interface MessageInputProps {
  onSendMessage: (text: string) => void
  value?: string
  onChange?: (value: string) => void
  isLoading: boolean
  onStopGeneration: () => void
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  value = "",
  onChange = () => {},
  isLoading,
  onStopGeneration,
}) => {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "45px"
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${Math.min(scrollHeight, 120)}px`
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && value.trim() && !isLoading) {
      e.preventDefault()
      onSendMessage(value)
      onChange("")
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (value.trim() && !isLoading) {
          onSendMessage(value)
          onChange("")
        }
      }}
      style={{ width: "100%" }}
    >
      <Flex gap={2} align="center" width="100%">
        <AudioRecorder onTranscription={onChange} />
        <Box flex="1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            minH="45px"
            maxH="120px"
            width="100%"
            overflowY="hidden" // Hide scrollbar by default
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
        </Box>
        <IconButton
          size="md"
          h="35px"
          w="35px"
          minW="35px"
          colorScheme={isLoading ? "gray" : "brand"}
          aria-label={isLoading ? "Stop generation" : "Send message"}
          icon={
            <Icon
              as={isLoading ? SmallCloseIcon : ArrowUpIcon}
              boxSize="16px"
            />
          }
          onClick={isLoading ? onStopGeneration : undefined}
          type={isLoading ? "button" : "submit"}
          isDisabled={!isLoading && !value.trim()}
        />
      </Flex>
    </form>
  )
}
