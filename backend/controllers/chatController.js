const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini SDK with API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment.");
}

const genAI = new GoogleGenerativeAI(apiKey || 'uninitialized');

// System instruction requested by user
const systemInstruction = `You are an expert coding interview coach conducting a real interview.

Your responsibilities:
- Ask coding and DSA questions based on the selected topic and difficulty
- Evaluate user answers strictly like an interviewer
- Provide feedback on correctness, logic, and optimization
- Give hints instead of direct answers unless the user asks for full solution
- Always mention time and space complexity when explaining solutions

Interview Mode Rules:
- If the user says "start interview", begin with one question
- Ask ONLY one question at a time
- Wait for the user's answer before continuing
- After user answers:
    - Tell if the answer is Correct, Partially Correct, or Incorrect
    - Explain why
    - Suggest improvements
    - Ask a follow-up question or next question

Concept Mode Rules:
- If the user asks for explanation (like "explain arrays"), teach clearly with examples
- Keep explanations simple and structured

General Behavior:
- Be concise but helpful
- Encourage the user like a mentor
- Do NOT go out of coding interview domain
- Adapt to user level (easy/medium/hard)

GAME MODE SCORING (CRITICAL UI PROTOCOL): 
- Whenever you evaluate a user's answer to a problem, you MUST begin your response strictly with "[SCORE: 10]" if the answer is completely correct and optimal, "[SCORE: 5]" for a partially correct answer, or "[SCORE: 0]" if it's completely wrong.`;

const handleChat = async (req, res) => {
  try {
    const { history, topic, difficulty, isMock, mockContext } = req.body;
    
    // history should be an array of messages objects
    // Example: [{ role: 'user', content: 'hello' }, { role: 'model', content: 'hi' }, ...]
    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'Message history is required and cannot be empty.' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in server environment.' });
    }

    // Initialize the model, providing our system instruction
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction 
    });

    // The Gemini API format for history is:
    // [{ role: 'user', parts: [{ text: '...' }] }, { role: 'model', parts: [{ text: '...' }] }]
    const latestMessageObj = history[history.length - 1];
    if (latestMessageObj.role !== 'user') {
      return res.status(400).json({ error: 'Latest message must be from the user.' });
    }
    
    // Format history without the latest message
    const formattedHistory = history.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role, // Ensure assistant is mapped to model
      parts: [{ text: msg.content }]
    }));
    
    let evalMessage = latestMessageObj.content;
    
    if (isMock && mockContext) {
      evalMessage = `You are conducting a mock interview.

Candidate role: ${mockContext.role}
Skills: ${mockContext.skills}

User answer: ${evalMessage}

Do:
- Evaluate answer
- Provide feedback
- Ask next question`;
    } else if (history.length === 1 && topic && difficulty) {
      evalMessage = `[Context: I want to practice ${topic} at ${difficulty} difficulty.]\n\n${evalMessage}`;
    }

    // Start chat session securely
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Send the latest message
    const result = await chat.sendMessage(evalMessage);
    const reply = result.response.text();

    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
};

const handleMockInit = async (req, res) => {
  try {
    const { role, skills, resume } = req.body;
    if (!role || !skills || !resume) {
      return res.status(400).json({ error: 'Missing role, skills, or resume.' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in server environment.' });
    }

    const prompt = `You are a technical interviewer.

Candidate details:
Role: ${role}
Skills: ${skills}
Resume: ${resume}

Start a mock interview:
- Ask the first question based on resume/projects
- Focus on role and skills
- Ask ONLY ONE question
- DO NOT INCLUDE ANY SCORE TAG FOR THE VERY FIRST QUESTION`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    
    return res.status(200).json({ reply: result.response.text() });
  } catch (error) {
    console.error('Error with Gemini API /mock:', error);
    return res.status(500).json({ error: 'Failed to generate mock interview question' });
  }
};

module.exports = {
  handleChat,
  handleMockInit,
};
