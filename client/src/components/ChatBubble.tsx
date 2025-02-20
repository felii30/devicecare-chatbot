import React from "react"
import { Box, Text, Flex } from "@chakra-ui/react"
import { BotIcon } from "./BotIcon.tsx"
import { keyframes } from "@emotion/react"

const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

interface ChatBubbleProps {
  message: string
  isUser: boolean
  isLoading?: boolean
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser,
  isLoading = false,
}) => {
  return (
    <Flex
      w="100%"
      py={6}
      px={4}
      bg={isUser ? "gray.50" : "white"}
      borderBottom="1px"
      borderColor="gray.100"
      gap={4}
    >
      {!isUser && (
        <Box flexShrink={0}>
          <Box
            animation={
              isLoading ? `${spinAnimation} 2s linear infinite` : "none"
            }
          >
            <BotIcon boxSize="24px" color="brand.500" />
          </Box>
        </Box>
      )}
      <Box maxW="4xl" mx="auto" w="100%">
        <Text whiteSpace="pre-wrap" color="gray.800">
          {message}
        </Text>
      </Box>
    </Flex>
  )
}
