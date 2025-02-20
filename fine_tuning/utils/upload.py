import openai
import os
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Ensure the key is set
if not api_key:
    raise ValueError("Missing OpenAI API Key. Set it in your .env file.")

# Set up OpenAI client
client = openai.OpenAI(api_key=api_key)

# Path to your fine-tuning dataset
file_path = "../data/faq_dataset.jsonl"

# Upload the file
response = client.files.create(
    file=open(file_path, "rb"),
    purpose="fine-tune"
)

# Print file ID
print(f"File uploaded successfully! File ID: {response.id}")
