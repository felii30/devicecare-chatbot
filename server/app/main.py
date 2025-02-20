from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

@app.post("/chat")
async def chat(message: ChatMessage) -> Dict[str, str]:
    try:
        # Create a new conversation for each request
        messages = [
            {"role": "system", "content": "You are a DeviceCare customer support chatbot. Only answer based on the FAQ. If a question is out of scope, politely decline."},
            {"role": "user", "content": message.message}
        ]
        
        # Get response from OpenAI using fine-tuned model
        response = openai.chat.completions.create(
            model="ft:gpt-4o-2024-08-06:personal::B2NTdmw0",
            messages=messages,
            temperature=0,
        )
        
        return {"message": response.choices[0].message.content}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
