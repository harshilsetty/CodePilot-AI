# CodePilot AI

**CodePilot AI** is an intelligent, resume-driven technical coding interview coach powered by the Google Gemini API (`gemini-2.5-flash`). It simulates a rigorous technical interview environment, allowing candidates to practice their system design and DSA problems against a highly contextualized AI logic engine.

## Features
- **Mock Interview Mode:** Supply your target role, core skills, and resume to trigger a fully customized, one-on-one technical screening identical to real-world technical interview loops.
- **Concept & Problem Solving Mode:** Practice arrays, hashing, dynamic programming, and more with automated difficulty scaling.
- **Real-Time Evaluation:** CodePilot AI automatically validates your responses, highlighting Big-O space/time complexities and missing optimal data structures.
- **Premium Frontend:** A beautiful, logic-focused UI built entirely with React, Vite, and Tailwind CSS v3.
- **Fast Backend Engine:** A lightweight Express.js node wrapper communicating securely with Google Generative AI.

## Project Structure
\`\`\`text
/backend/
  |- controllers/chatController.js  # Core logic for handling Gemini API and Mock Mode prompts
  |- routes/chatRoutes.js           # API route declarations
  |- server.js                      # Express configuration
  |- .env                           # Local environment keys (GEMINI_API_KEY)

/frontend/
  |- src/components/ChatWindow.jsx         # Render loops for the chat terminal
  |- src/components/Sidebar.jsx            # Topic and view toggles
  |- src/components/MockInterviewSetup.jsx # Config form for Resume injection
  |- tailwind.config.js                    # Design system configuration
\`\`\`

## Getting Started

### 1. Backend Setup
1. Navigate into the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root of the backend folder and add your key: `GEMINI_API_KEY=your_key_here`
4. Start the server: `npm run start`

### 2. Frontend Setup
1. Navigate into the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`

Open your browser to `http://localhost:5173` to interact with CodePilot AI.
