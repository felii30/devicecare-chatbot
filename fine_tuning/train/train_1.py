import openai
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Ensure the key is set
if not api_key:
    raise ValueError("Missing OpenAI API Key. Set it in your .env file.")

# Set up OpenAI client
client = openai.OpenAI(api_key=api_key)

# Update this line with the new file ID from step 2
file_id = "your-new-file-id"

# Start fine-tuning job
response = client.fine_tuning.jobs.create(
    training_file=file_id,
    model="gpt-4o-2024-08-06"
)

# Print fine-tune job ID
print(f"Fine-tuning started! Job ID: {response.id}")
