/**
 * SendButton component handles the send/stop action in the chat interface.
 * It switches between send and stop icons based on loading state.
 */
import React from "react"
import { IconButton, Icon } from "@chakra-ui/react"
import { ArrowUpIcon, SmallCloseIcon } from "@chakra-ui/icons"

interface SendButtonProps {
  isLoading: boolean
  onStopGeneration: () => void
  isDisabled: boolean
}

export const SendButton: React.FC<SendButtonProps> = ({
  isLoading,
  onStopGeneration,
  isDisabled,
}) => (
  <IconButton
    size="md"
    h="35px"
    w="35px"
    minW="35px"
    colorScheme={isLoading ? "gray" : "brand"}
    aria-label={isLoading ? "Stop generation" : "Send message"}
    icon={<Icon as={isLoading ? SmallCloseIcon : ArrowUpIcon} boxSize="16px" />}
    onClick={isLoading ? onStopGeneration : undefined}
    type={isLoading ? "button" : "submit"}
    isDisabled={!isLoading && isDisabled}
  />
)
