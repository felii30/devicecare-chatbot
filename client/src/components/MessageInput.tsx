import React, { useState } from "react"
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
      <Flex gap={2}>
        <Box flex="1" position="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            minH="50px"
            maxH="200px"
            resize="none"
            bg="white"
            border="1px"
            borderColor="gray.200"
            _hover={{ borderColor: "gray.300" }}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "none",
              "& + div": {
                zIndex: 2,
              },
            }}
            pr="40px"
            rows={1}
          />
          <Flex
            position="absolute"
            bottom={2}
            right={2}
            align="center"
            gap={2}
            zIndex={1}
          >
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
        </Box>
      </Flex>
    </form>
  )
}
