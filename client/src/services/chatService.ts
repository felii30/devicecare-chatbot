const API_BASE_URL = 'http://localhost:8000'

interface ChatResponse {
  message: string
}

export const sendMessage = async (message: string, threadId: string): Promise<ChatResponse> => {
  try {
    const response = await fetch("http://localhost:8000/chat", {
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
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to transcribe audio');
    }

    const data = await response.json();
    return data.text;
}; 