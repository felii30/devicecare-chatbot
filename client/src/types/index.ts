export interface Message {
  id: string
  text: string
  isUser: boolean
}

export interface Thread {
  id: number
  title: string
  messages: Message[]
}

export interface ChatProps {
  onSendMessage: (text: string) => void
  isLoading: boolean
  onStopGeneration: () => void
  value?: string
  onChange: (text: string) => void
} 