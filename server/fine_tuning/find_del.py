import openai
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Set up OpenAI client
client = openai.OpenAI(api_key=api_key)

# Retrieve all fine-tuning jobs
response = client.fine_tuning.jobs.list()

# Print the job IDs and statuses
for job in response.data:
    print(f"Job ID: {job.id}, Status: {job.status}")
