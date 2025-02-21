/**
 * Chat service for DeviceCare's customer support chatbot
 * 
 * Communicates with a fine-tuned GPT-4 model
 * that was trained on DeviceCare's FAQ documentation. The model provides responses
 * strictly based on the FAQ content and maintains a consistent support-oriented tone.
 */

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

interface ChatResponse {
  message: string
}

/**
 * Sends a message to the chatbot and returns the response
 * @param message - The user's message
 * @param threadId - Optional thread ID for conversation context
 */
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

/**
 * Transcribes audio to text using OpenAI's Whisper model
 * @param audioBlob - The recorded audio as a Blob
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append("audio", audioBlob, "audio.webm")
    
    const response = await fetch(`${API_URL}/transcribe`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Transcription error details:", errorData)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.text
  } catch (error) {
    console.error("Error transcribing audio:", error)
    throw error
  }
}
