export interface Message {
  id: number
  text: string
  isUser: boolean
}

export interface Thread {
  id: number
  title: string
  messages: Message[]
} 