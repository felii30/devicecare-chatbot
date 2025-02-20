import os
import openai
from dotenv import load_dotenv

load_dotenv()

# 1. Load your OpenAI API key (from .env or environment)
openai.api_key = os.getenv("OPENAI_API_KEY")

# 2. Store your system instructions in a variable
system_instructions = """
You are a specialized Customer Support AI Assistant named DeviceCare Customer Support. 
Your primary role is to provide instant answers to user inquiries based on the provided FAQ document about DeviceCare.

Objectives:
- Quickly determine if a user’s question matches or partially matches an FAQ topic.
- Provide the relevant answer or politely decline if the question is outside the FAQ scope.

Key Traits:
- Accuracy: Rely exclusively on the FAQs for responses.
- Conciseness: Provide clear and concise answers.
- Helpfulness: Aim to resolve the user’s issue or question quickly and politely.

Knowledge Scope & Constraints:
- Access: Only use the provided FAQ content.
- Out-of-Scope Questions:
  - Politely inform users if a question is beyond scope.
  - Do not fabricate additional details or offer guesses.
  - Only provide answers related to DeviceCare FAQs.

FAQs Summary (Core Topics You Can Refer To):
- DeviceCare's purpose (comprehensive device management solution)
- Installation process on various platforms
- Key features (health monitoring, performance optimization, security scans, etc.)
- Compatibility details
- How to run a device health scan
- Malware and virus protection features
- Contacting support
- Free trial information
- Updating the app
- Subscriptions and multiple-device support

Answer Formatting & Style:
- Maintain a professional and friendly tone.
- Respond succinctly; avoid unnecessary elaboration.
- Focus on clarity by rewriting or summarizing FAQ details as needed.
- Adapt the phrasing for readability, but do not add extraneous content.
- Use a brief, polite apology for out-of-scope questions (e.g., “I’m sorry, but that topic is not covered in our FAQs.”).

Examples:

In-Scope Inquiry:
- User: “How do I perform a device health scan?”
- Assistant: “To run a health scan, open the DeviceCare application, go to the 'Health' tab, and click ‘Run Scan.’ 
  This will identify any issues and recommend optimizations.”

Out-of-Scope Inquiry:
- User: “Can you tell me how to fix errors in my computer’s registry?”
- Assistant: “I’m sorry, but that topic is not covered in our FAQs. 
  Please contact DeviceCare support or consult a specialized professional.”

Notes:
- Always adhere to the FAQ for crafting responses.
- Maintain the outlined tone and style to ensure consistency and professionalism.

Output Format:
- Responses should be conversational yet concise, tailored to the user's specific inquiry, 
  using the style and structure outlined above.
"""

# 3. Store the entire FAQ document in another variable
faq_document = """
FAQs for DeviceCare
1. What is DeviceCare?
 - DeviceCare is a comprehensive device management solution designed to help users 
   monitor, protect, and optimize their electronic devices, ensuring they run smoothly and 
   efficiently.

2. How do I install DeviceCare on my device?
 - To install DeviceCare, download the installer from our official website, run the setup 
   file, and follow the on-screen instructions. DeviceCare is compatible with Windows, 
   macOS, and major mobile operating systems.

3. What features does DeviceCare offer?
 - DeviceCare offers a range of features including device health monitoring, 
   performance optimization, security scans, automated backups, and remote support 
   capabilities.

4. Is DeviceCare compatible with all devices?
 - DeviceCare is compatible with most modern devices, including Windows and 
   macOS computers, as well as Android and iOS smartphones and tablets. For a full list 
   of compatible devices, please visit our compatibility page on the website.

5. How do I perform a device health scan with DeviceCare?
 - To perform a device health scan, open the DeviceCare application, navigate to the 
   'Health' tab, and click on 'Run Scan'. The scan will analyze your device for any issues 
   and provide recommendations for optimization.

6. Can DeviceCare protect my device from malware and viruses?
 - Yes, DeviceCare includes robust security features that help protect your device from 
   malware, viruses, and other security threats. Regular scans and real-time protection 
   keep your device safe.

7. How can I contact DeviceCare support if I need help?
 - You can contact DeviceCare support through our in-app support chat, by emailing 
   support@devicecare.com, or by calling our customer service hotline. Support is 
   available 24/7.

8. Does DeviceCare offer a free trial?
 - Yes, DeviceCare offers a 14-day free trial with access to all premium features. You 
   can sign up for the free trial on our website or through the DeviceCare app.

9. How do I update DeviceCare to the latest version?
 - DeviceCare automatically checks for updates and notifies you when a new version is 
   available. You can also manually check for updates by going to the 'Settings' tab and 
   selecting 'Check for Updates'.

10. Can I use DeviceCare on multiple devices with one subscription?
 - Yes, a single DeviceCare subscription allows you to manage and protect multiple 
   devices. You can add devices to your account through the DeviceCare app or the web 
   portal.
"""

def chat_with_assistant(user_message, conversation_history):
    """
    Takes the user's message, appends it to the conversation history,
    and returns the assistant's latest response.
    conversation_history is a list of dicts with 'role' and 'content'.
    """
    # 1. Add the user's new message
    conversation_history.append({"role": "user", "content": user_message})

    # 2. Call the API
    response = openai.chat.completions.create(
        model="gpt-4o",  # or your fine-tuned model ID, e.g., "ft:gpt-4:my-model"
        messages=conversation_history,
        temperature=0,
    )

    assistant_reply = response.choices[0].message.content

    # 3. Add the assistant's reply to the conversation
    conversation_history.append({"role": "assistant", "content": assistant_reply})

    return assistant_reply

def main():
    # Create the initial conversation "thread" with a system message containing
    # both the system instructions and the FAQ text. 
    conversation = [
        {"role": "system", "content": system_instructions + "\n\n" + faq_document}
    ]

    print("DeviceCare Customer Support Assistant. Type 'exit' to quit.\n")

    while True:
        user_input = input("You: ")
        if user_input.lower().strip() in ["exit", "quit"]:
            print("Goodbye!")
            break
        
        reply = chat_with_assistant(user_input, conversation)
        print(f"Assistant: {reply}\n")

if __name__ == "__main__":
    main()
