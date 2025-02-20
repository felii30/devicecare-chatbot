# DeviceCare Chatbot

A conversational AI assistant for DeviceCare - your comprehensive device management solution. This chatbot helps users interact with DeviceCare's features for monitoring, protecting, and optimizing electronic devices.

## Deployed Application

Visit the deployed version at: [https://devicecare-chatbot-feliciapaulus.vercel.app](https://devicecare-chatbot-feliciapaulus.vercel.app)

## About DeviceCare

DeviceCare is a comprehensive device management solution designed to help users monitor, protect, and optimize their electronic devices, ensuring they run smoothly and efficiently.

## Features

- Real-time chat interface for customer support
- Voice input with transcription
- Conversation history
- Integration with GPT-4o (gpt-4o-2024-08-06) - [View Fine-Tuning Documentation](fine_tuning/README.md)

## Development Setup

### Prerequisites

- Node.js (v19 or higher) - required for React v19
- npm (v8 or higher) or yarn
- Python 3.11 or higher
- pip (v20 or higher recommended)
- OpenAI API key
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Setting up the Backend

1. Navigate to the server directory:

   ```bash
   cd server/app
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   # Activate the virtual environment:
   # On Linux/macOS:
   # source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```

3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

The server will run on `http://localhost:8000`

### Setting up the Frontend

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start
   ```

The React application will run on `http://localhost:3000`

## Environment Variables

### Frontend

- `REACT_APP_API_URL`: Backend API URL
  - Development: http://localhost:8000
  - Production: Deployed API URL

### Backend

- `OPENAI_API_KEY`: Your OpenAI API key (Keep this secret!)

## Deployment

The application is deployed using:

- Frontend: Vercel
- Backend: AWS EC2 with Nginx

## License

[MIT License](LICENSE)
