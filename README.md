# Voice AI Callback Service

A Next.js application that provides an immersive voice callback experience using AI. The service allows users to request a callback, receive an AI-powered phone call to collect information, and access a secure platform with their collected data.

## Features

- Callback request form with phone and email collection
- AI-powered voice calls using Vapi
- Natural conversation flow for information collection
- Secure authentication using Firebase
- Passwordless authentication via email
- Organized display of collected information

## Prerequisites

- Node.js 18+ and npm
- Firebase account
- Vapi account and API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd voice-chat
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.local.example` and fill in your credentials:
```bash
cp .env.local.example .env.local
```

4. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Configure passwordless email authentication
   - Add your Firebase configuration to `.env.local`

5. Set up Vapi:
   - Create a Vapi account
   - Get your API key
   - Add your Vapi API key to `.env.local`

6. Run the development server:
```bash
npm run dev
```

## Usage

1. Users access the callback form and enter their phone number and email
2. The AI agent calls the user and collects information through natural conversation
3. After the call, the user receives an email with a secure authentication link
4. The user clicks the link to access their secure dashboard
5. The secure dashboard displays all collected information in an organized format

## Technical Stack

- Frontend: Next.js with TypeScript
- Styling: Tailwind CSS
- Authentication: Firebase Authentication
- Database: Firebase Firestore
- Voice AI: Vapi

## Security Considerations

- All sensitive data is stored securely in Firebase
- Passwordless authentication ensures secure access
- Environment variables protect API keys and credentials
- HTTPS is required for production deployment

## Development

To contribute to the project:

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT License
