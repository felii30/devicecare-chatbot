# DeviceCare GPT-4 Fine-Tuning Process Documentation

## Overview

This document outlines the process of fine-tuning GPT-4o with DeviceCare's FAQ dataset to create a specialized customer support chatbot.

## Fine-Tuning Steps

### 1. Data Preparation

- Created a structured JSONL dataset containing FAQ entries
- Format includes system message, user queries, and assistant responses
- Example entry:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a DeviceCare customer support chatbot. Only answer based on the FAQ. If a question is out of scope, politely decline."
    },
    {
      "role": "user",
      "content": "Can you explain what DeviceCare does?"
    },
    {
      "role": "assistant",
      "content": "DeviceCare is a comprehensive device management solution designed to help users monitor, protect, and optimize their electronic devices, ensuring they run smoothly and efficiently."
    }
  ]
}
```

### 2. Data Upload Process

```python
import openai
import os
from dotenv import load_dotenv

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Upload training file
response = client.files.create(
    file=open("../data/faq_dataset.jsonl", "rb"),
    purpose="fine-tune"
)
file_id = response.id
```

### 3. Fine-Tuning Initiation

```python
# Start fine-tuning job
response = client.fine_tuning.jobs.create(
    training_file=file_id,
    model="gpt-4o-2024-08-06"
)
job_id = response.id
```

### 4. Progress Monitoring

```python
# Monitor progress
status = client.fine_tuning.jobs.retrieve(job_id)
print(f"Status: {status.status}")
```

## Model Testing and Validation

### Implementation

```python
def chat_with_assistant(user_message, thread_id, conversation_histories):
    if thread_id not in conversation_histories:
        conversation_histories[thread_id] = [
            {"role": "system", "content": "You are a DeviceCare customer support chatbot..."}
        ]

    conversation_histories[thread_id].append({"role": "user", "content": user_message})

    response = openai.chat.completions.create(
        model="ft:gpt-4o-2024-08-06:personal::B2NTdmw0",
        messages=conversation_histories[thread_id],
        temperature=0,
    )
    return response.choices[0].message.content
```

### Key Features Achieved

1. Contextual Awareness

   - Maintains conversation history
   - Handles multi-turn interactions

2. Scope Management

   - Clear boundaries for queries
   - Appropriate handling of out-of-scope questions

3. Response Consistency
   - Strict adherence to FAQ content

## Version Control

### Current Version

- Model: `ft:gpt-4o-2024-08-06:personal::B2NTdmw0`
- Dataset Version: 1.0
