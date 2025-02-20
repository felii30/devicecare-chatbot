from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI app
app = FastAPI(
    title="DeviceCare Chat API",
    description="API for DeviceCare's customer support chatbot using OpenAI's fine-tuned model",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    """
    Schema for chat messages sent by clients.
    
    Attributes:
        message (str): The text content of the message
        thread_id (Optional[str]): Unique identifier for the conversation thread
    """
    message: str
    thread_id: Optional[str] = None

# Store conversation histories by thread ID
conversation_histories = {}

@app.post("/chat")
async def chat(message: ChatMessage) -> Dict[str, str]:
    """
    Process incoming chat messages and return AI responses.
    
    Args:
        message (ChatMessage): Contains the message text and optional thread_id
        
    Returns:
        Dict[str, str]: Contains the AI's response message
        
    Raises:
        HTTPException: If there's an error processing the message
    """
    try:
        thread_id = message.thread_id
        
        # Initialize new conversation if thread_id doesn't exist
        if not thread_id or thread_id not in conversation_histories:
            conversation_histories[thread_id] = [
                {"role": "system", "content": "You are a DeviceCare customer support chatbot. Only answer based on the FAQ. If a question is out of scope, politely decline."}
            ]
        
        # Add user message to thread history
        conversation_histories[thread_id].append({"role": "user", "content": message.message})
        
        # Get response from OpenAI using fine-tuned model
        response = openai.chat.completions.create(
            model="ft:gpt-4o-2024-08-06:personal::B2NTdmw0",
            messages=conversation_histories[thread_id],
            temperature=0,
        )
        
        assistant_reply = response.choices[0].message.content
        
        # Add assistant response to thread history
        conversation_histories[thread_id].append({"role": "assistant", "content": assistant_reply})
        
        return {"message": assistant_reply}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint to verify API is running.
    
    Returns:
        Dict[str, str]: Status message indicating the API is healthy
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
