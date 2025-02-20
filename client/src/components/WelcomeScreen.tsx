import React from "react"
import { Box, Flex, Heading, Text, Grid, Button } from "@chakra-ui/react"
import { MessageInput } from "./MessageInput.tsx"
import {
  gradientAnimation,
  floatAnimation1,
  floatAnimation2,
  floatAnimation3,
  fadeIn,
  gradientMove,
} from "../animations/chatAnimations.ts"

interface WelcomeScreenProps {
  onSendMessage: (text: string) => void
  isLoading: boolean
  onStopGeneration: () => void
  onExampleClick: (prompt: string) => void
}

const EXAMPLE_PROMPTS = [
  "What services does DeviceCare offer?",
  "How do I perform a device health scan?",
  "Do you offer a free trial?",
  "Can you help with device protection?",
]

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSendMessage,
  isLoading,
  onStopGeneration,
  onExampleClick,
}) => {
  return (
    <Flex
      minH="100vh"
      direction="column"
      bg="white"
      position="relative"
      overflow="hidden"
      px={{ base: 4, md: 6 }}
    >
      {/* Gradient Blobs */}
      <GradientBlobs />

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
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            onStopGeneration={onStopGeneration}
          />
          <ExamplePrompts onExampleClick={onExampleClick} />
        </Box>
      </Flex>
    </Flex>
  )
}

const GradientBlobs = () => (
  <>
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
  </>
)

const ExamplePrompts: React.FC<{
  onExampleClick: (prompt: string) => void
}> = ({ onExampleClick }) => (
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
          onClick={() => onExampleClick(prompt)}
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
)
