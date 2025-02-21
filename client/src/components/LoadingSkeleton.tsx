/**
 * Loading indicator components for the chat interface.
 * Provides visual feedback during API calls and message processing.
 */

import React from "react"
import { Box, HStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import { BotIcon } from "./BotIcon.tsx"

// Animation keyframes
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`

const dotAnimation = keyframes`
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
`

interface BouncingIconProps {
  size?: string
  color?: string
}

/**
 * Animated bot icon that bounces up and down
 */
const BouncingIcon: React.FC<BouncingIconProps> = ({
  size = "24px",
  color = "brand.500",
}) => (
  <Box
    color={color}
    minW="40px"
    h="40px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    animation={`${bounce} 1s ease-in-out infinite`}
  >
    <BotIcon boxSize={size} />
  </Box>
)

interface LoadingDotsProps {
  color?: string
}

/**
 * Animated dots that indicate loading state
 */
const LoadingDots: React.FC<LoadingDotsProps> = ({ color = "gray.500" }) => (
  <Box
    color={color}
    _after={{
      content: "''",
      animation: `${dotAnimation} 1.5s steps(4) infinite`,
    }}
  />
)

/**
 * Combined loading skeleton with bouncing icon and dots
 */
export const LoadingSkeleton = () => (
  <HStack spacing={2} p={4}>
    <BouncingIcon />
    <LoadingDots />
  </HStack>
)
