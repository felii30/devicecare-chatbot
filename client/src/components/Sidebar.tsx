import React from "react"
import {
  VStack,
  Button,
  Box,
  Text,
  Icon,
  Flex,
  IconButton,
} from "@chakra-ui/react"
import { AddIcon, ChatIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons"

interface Thread {
  id: number
  title: string
  active?: boolean
}

interface SidebarProps {
  threads: Thread[]
  onNewChat: () => void
  onSelectThread: (id: number) => void
  activeThreadId?: number
  isOpen: boolean
  onToggle: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  threads,
  onNewChat,
  onSelectThread,
  activeThreadId,
  isOpen,
  onToggle,
}) => {
  return (
    <>
      <IconButton
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        onClick={onToggle}
        position="fixed"
        top={4}
        left={isOpen ? "276px" : 4}
        zIndex={2}
        size="sm"
        aria-label="Toggle Sidebar"
        variant="ghost"
      />
      <Box
        w="260px"
        h="100vh"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        p={4}
        position="fixed"
        left={isOpen ? 0 : "-260px"}
        transition="left 0.3s"
        zIndex={1}
      >
        <VStack spacing={4} align="stretch" mt={12}>
          <Button
            leftIcon={<AddIcon />}
            onClick={onNewChat}
            colorScheme="brand"
            variant="outline"
            w="full"
          >
            New chat
          </Button>

          <VStack spacing={2} align="stretch">
            {threads.map((thread) => (
              <Button
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                variant="ghost"
                justifyContent="flex-start"
                h="auto"
                py={2}
                px={3}
                bg={activeThreadId === thread.id ? "gray.100" : "transparent"}
                _hover={{ bg: "gray.50" }}
              >
                <Flex align="center">
                  <Icon as={ChatIcon} mr={2} />
                  <Text noOfLines={2} fontSize="sm">
                    {thread.title}
                  </Text>
                </Flex>
              </Button>
            ))}
          </VStack>
        </VStack>
      </Box>
    </>
  )
}
