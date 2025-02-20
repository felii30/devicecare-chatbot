/**
 * MessageInput component handles text input and voice recording for chat messages.
 * It provides a textarea for text input and integrates with AudioRecorder for voice input.
 */
import React, { useRef, useEffect } from "react"
import { Textarea, Flex, Box } from "@chakra-ui/react"
import { SendButton } from "./SendButton.tsx"
import AudioRecorder from "./AudioRecorder.tsx"
import { ChatProps } from "../../types"

export const MessageInput: React.FC<ChatProps> = ({
  onSendMessage,
  isLoading,
  onStopGeneration,
  value = "",
  onChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
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
            overflowY="hidden"
            resize="none"
            {...sharedTextareaStyles}
          />
        </Box>
        <SendButton
          isLoading={isLoading}
          onStopGeneration={onStopGeneration}
          isDisabled={!value.trim()}
        />
      </Flex>
    </form>
  )
}

// Shared styles for consistent textarea appearance
const sharedTextareaStyles = {
  bg: "white",
  border: "1px",
  borderColor: "gray.200",
  borderRadius: "15px",
  _hover: { borderColor: "gray.300" },
  _focus: { borderColor: "brand.500", boxShadow: "none" },
  py: { base: 2, sm: 3 },
  px: { base: 3, sm: 3 },
  fontSize: { base: "sm", sm: "md" },
  lineHeight: "1.5",
}
