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

# Update with your new fine-tune job ID
job_id = "ftjob-l08E8H1hljmtioiMw8ALkkTu"

# Check status
response = client.fine_tuning.jobs.retrieve(job_id)

# Print status
print(response)
