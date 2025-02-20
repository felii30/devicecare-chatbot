export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

/**
 * Chat service for DeviceCare's customer support chatbot
 * 
 * Communicates with a fine-tuned GPT-4 model (ft:gpt-4o-2024-08-06:personal::B2NTdmw0)
 * that was trained on DeviceCare's FAQ documentation. The model provides responses
 * strictly based on the FAQ content and maintains a consistent support-oriented tone.
 */

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
