import os
import openai
from dotenv import load_dotenv

load_dotenv()

# 1. Load your OpenAI API key (from .env or environment)
openai.api_key = os.getenv("OPENAI_API_KEY")

def chat_with_assistant(user_message, thread_id, conversation_histories):
    """
    Takes the user's message and thread_id, manages conversation history per thread,
    and returns the assistant's latest response.
    """
    # Initialize conversation for new threads
    if thread_id not in conversation_histories:
        conversation_histories[thread_id] = [
            {"role": "system", "content": "You are a DeviceCare customer support chatbot. Only answer based on the FAQ. If a question is out of scope, politely decline."}
        ]
    
    # Add the user's message
    conversation_histories[thread_id].append({"role": "user", "content": user_message})

    # Call the API with the thread's conversation history
    response = openai.chat.completions.create(
        model="ft:gpt-4o-2024-08-06:personal::B2NTdmw0",
        messages=conversation_histories[thread_id],
        temperature=0,
    )

    assistant_reply = response.choices[0].message.content
    
    # Add the assistant's reply to the conversation history
    conversation_histories[thread_id].append({"role": "assistant", "content": assistant_reply})

    return assistant_reply

def test_threads():
    # Store conversation histories for different threads
    conversation_histories = {}
    
    # Test Thread 1: Questions about DeviceCare features
    print("\n=== Thread 1: Features Discussion ===")
    thread_1 = "thread_1"
    
    messages_1 = [
        "What is DeviceCare?",
        "What features does it offer?",
        "How do I run a health scan?"
    ]
    
    for msg in messages_1:
        print(f"\nUser: {msg}")
        reply = chat_with_assistant(msg, thread_1, conversation_histories)
        print(f"Assistant: {reply}")
        
    # Test Thread 2: Questions about installation and compatibility
    print("\n=== Thread 2: Installation Questions ===")
    thread_2 = "thread_2"
    
    messages_2 = [
        "How do I install DeviceCare?",
        "Is it compatible with my iPhone?",
        "Do you offer a free trial?"
    ]
    
    for msg in messages_2:
        print(f"\nUser: {msg}")
        reply = chat_with_assistant(msg, thread_2, conversation_histories)
        print(f"Assistant: {reply}")
    
    # Test Thread 1 again to verify context retention
    print("\n=== Back to Thread 1: Following up on features ===")
    msg = "Can you tell me more about the security features?"
    print(f"\nUser: {msg}")
    reply = chat_with_assistant(msg, thread_1, conversation_histories)
    print(f"Assistant: {reply}")
    
    # Test out-of-scope questions
    print("\n=== Thread 3: Out-of-scope Questions ===")
    thread_3 = "thread_3"
    
    messages_3 = [
        "How do I fix my printer?",
        "Can you recommend a good antivirus?",
        "My computer is making strange noises, what should I do?",
    ]
    
    for msg in messages_3:
        print(f"\nUser: {msg}")
        reply = chat_with_assistant(msg, thread_3, conversation_histories)
        print(f"Assistant: {reply}")
    
    # Print conversation lengths to verify history maintenance
    print("\n=== Conversation History Lengths ===")
    for thread_id, history in conversation_histories.items():
        print(f"Thread {thread_id}: {len(history)} messages")

if __name__ == "__main__":
    test_threads()
