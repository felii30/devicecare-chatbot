/**
 * Sidebar component for chat thread management.
 * Provides navigation between different chat threads and new chat creation.
 */

import React from "react"
import {
  Box,
  VStack,
  Button,
  Text,
  Flex,
  Divider,
  IconButton,
} from "@chakra-ui/react"
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons"

interface SidebarProps {
  /** List of chat threads */
  threads: Array<{ id: number; title: string }>

  /** Callback to start a new chat */
  onNewChat: () => void

  /** Callback when a thread is selected */
  onSelectThread: (id: number) => void

  /** Currently active thread ID */
  activeThreadId?: number

  /** Controls sidebar visibility on mobile */
  isOpen: boolean

  /** Callback to toggle sidebar visibility */
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
      {/* Hamburger button */}
      {!isOpen && (
        <IconButton
          icon={<HamburgerIcon />}
          onClick={onToggle}
          position="fixed"
          top={4}
          left={4}
          zIndex={20}
          size="sm"
          aria-label="Open Sidebar"
        />
      )}

      {/* Sidebar container */}
      <Box
        position="fixed"
        left={0}
        top={0}
        h="100vh"
        w="260px"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
        transition="transform 0.3s"
        zIndex={20}
      >
        <VStack p={4} spacing={4} align="stretch">
          <Flex justify="space-between" align="center">
            <IconButton
              icon={<HamburgerIcon />}
              onClick={onToggle}
              size="sm"
              aria-label="Close Sidebar"
            />
            <Button
              leftIcon={<AddIcon />}
              onClick={onNewChat}
              colorScheme="brand"
              variant="outline"
              size="sm"
              flex={1}
              ml={2}
            >
              New Chat
            </Button>
          </Flex>
          <Divider />
          <VStack align="stretch" spacing={2}>
            {threads.map((thread) => (
              <Button
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                variant={activeThreadId === thread.id ? "solid" : "ghost"}
                colorScheme={activeThreadId === thread.id ? "brand" : "gray"}
                justifyContent="flex-start"
                size="sm"
                py={6}
                whiteSpace="normal"
                textAlign="left"
              >
                <Text noOfLines={1}>{thread.title}</Text>
              </Button>
            ))}
          </VStack>
        </VStack>
      </Box>
    </>
  )
}
