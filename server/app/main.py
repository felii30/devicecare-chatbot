from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

# Import system instructions and FAQ from scripts/main.py
from scripts.main import system_instructions, faq_document

# Initialize conversation history
conversation_history = [
    {"role": "system", "content": system_instructions + "\n\n" + faq_document}
]

@app.post("/api/chat")
async def chat(chat_message: ChatMessage) -> Dict[str, str]:
    try:
        # Add user message to history
        conversation_history.append({"role": "user", "content": chat_message.message})
        
        # Get response from OpenAI
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=conversation_history,
            temperature=0,
        )
        
        assistant_reply = response.choices[0].message.content
        
        # Add assistant response to history
        conversation_history.append({"role": "assistant", "content": assistant_reply})
        
        return {"response": assistant_reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
