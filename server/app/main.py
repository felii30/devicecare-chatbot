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

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
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
    {"role": "system", "content": "You are a DeviceCare customer support chatbot. Only answer based on the FAQ. If a question is out of scope, politely decline."}
]

@app.post("/chat")
async def chat(message: ChatMessage) -> Dict[str, str]:
    try:
        # Add user message to history
        conversation_history.append({"role": "user", "content": message.message})
        
        # Get response from OpenAI using fine-tuned model
        response = openai.chat.completions.create(
            model="ft:gpt-4o-2024-08-06:personal::B2NTdmw0",
            messages=conversation_history,
            temperature=0,  # Lower temperature for more consistent responses
        )
        
        assistant_reply = response.choices[0].message.content
        
        # Add assistant response to history
        conversation_history.append({"role": "assistant", "content": assistant_reply})
        
        return {"message": assistant_reply}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
