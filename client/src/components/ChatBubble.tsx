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
      py={{ base: 2, md: 4 }}
      px={{ base: 2, md: 4 }}
      justify={isUser ? "flex-end" : "flex-start"}
      mb={4}
    >
      <Flex
        bg={isUser ? "gray.50" : "white"}
        borderRadius="15px"
        gap={4}
        maxW={isUser ? { base: "85%", md: "70%" } : "100%"}
        w={isUser ? "auto" : "100%"}
        py={{ base: 3, md: 4 }}
        px={{ base: 3, md: 4 }}
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
        <Box flex="1">
          <Text whiteSpace="pre-wrap" color="gray.800">
            {message}
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}
