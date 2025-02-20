from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Optional
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize FastAPI app
app = FastAPI(
    title="DeviceCare Chat API",
    description="API for DeviceCare's customer support chatbot",
    version="1.0.0"
)

class ChatMessage(BaseModel):
    message: str
    thread_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str

class TranscriptionResponse(BaseModel):
    text: str

# Store conversation histories by thread ID
conversation_histories = {}

@app.post("/chat")
async def chat(message: ChatMessage) -> ChatResponse:
    """Process incoming chat messages and return AI responses."""
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
        response = client.chat.completions.create(
            model="ft:gpt-4o-2024-08-06:personal::B2NTdmw0",
            messages=conversation_histories[thread_id],
            temperature=0,
        )
        
        assistant_reply = response.choices[0].message.content
        
        # Add assistant response to thread history
        conversation_histories[thread_id].append({"role": "assistant", "content": assistant_reply})
        
        return ChatResponse(message=assistant_reply)
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(..., description="The audio file to transcribe")
) -> TranscriptionResponse:
    """
    Transcribe uploaded audio to text using OpenAI's Whisper model.
    """
    try:
        # Validate file type
        if not audio.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=422,
                detail="File must be an audio file"
            )
            
        # Read the audio file into memory
        audio_data = await audio.read()
        
        if len(audio_data) == 0:
            raise HTTPException(
                status_code=422,
                detail="Audio file is empty"
            )
        
        # Save temporarily to disk (Whisper API requires a file)
        temp_audio_path = f"temp_{audio.filename}"
        with open(temp_audio_path, "wb") as f:
            f.write(audio_data)
        
        try:
            # Transcribe the audio using Whisper
            with open(temp_audio_path, "rb") as audio_file:
                transcript = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language="en"
                )
            
            return TranscriptionResponse(text=transcript.text)
        
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_audio_path):
                os.remove(temp_audio_path)
                
    except Exception as e:
        print(f"Error transcribing audio: {str(e)}")
        # Return more detailed error information
        return JSONResponse(
            status_code=422,
            content={"detail": str(e)}
        )

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
