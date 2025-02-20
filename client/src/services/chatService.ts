const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

interface ChatResponse {
  message: string
}

export const sendMessage = async (message: string, threadId?: string): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, thread_id: threadId }),
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData()
  formData.append("file", audioBlob)
  
  const response = await fetch(`${API_URL}/transcribe`, {
    method: "POST",
    body: formData,
  })
  const data = await response.json()
  return data.text
} 