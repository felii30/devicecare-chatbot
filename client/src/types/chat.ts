export interface Message {
  id: number
  text: string
  isUser: boolean
}

export interface Thread {
  id: number
  apiThreadId?: string
  title: string
  messages: Message[]
} 