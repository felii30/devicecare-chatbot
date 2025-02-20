# DeviceCare Chatbot

A conversational AI assistant for DeviceCare - your comprehensive device management solution. This chatbot is powered by GPT-4 and helps users interact with DeviceCare's features for monitoring, protecting, and optimizing electronic devices.

## About DeviceCare

DeviceCare is a comprehensive device management solution designed to help users monitor, protect, and optimize their electronic devices, ensuring they run smoothly and efficiently.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python 3.8 or higher
- pip
- API key for GPT-4

## Getting Started

### Setting up the Backend

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the server directory with your OpenAI API key:

   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the server:

   ```bash
   uvicorn main:app --reload
   ```

The server should now be running on `http://localhost:8000`

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

The client application should now be running on `http://localhost:3000`

## Features

- Real-time chat interface for customer support
- Integration with GPT-4o (gpt-4o-2024-08-06) for intelligent responses

## Environment Variables

### Backend

- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Server port (default: 8000)

### Frontend

- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)

## License

[MIT License](LICENSE)
