import openai
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Set up OpenAI client
client = openai.OpenAI(api_key=api_key)

# Replace with your actual fine-tune job ID
job_id = "ftjob-He2N8YHuWU3bcHz9owrVRGK8"

# Cancel the fine-tuning job
response = client.fine_tuning.jobs.cancel(job_id)

# Confirm cancellation
print(f"Fine-Tuning Job {job_id} has been cancelled.")
