const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const buildFallbackMockQuestion = (role, skills) => {
  const normalizedSkills = (skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const primarySkill = normalizedSkills[0] || 'problem solving';

  return `Let's begin your mock interview for the ${role} role.\n\nFirst question: Walk me through a project where you used ${primarySkill}. What was the problem, your approach, trade-offs you considered, and the final impact?`;
};

// Initialize Gemini SDK with API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment.");
}

const genAI = new GoogleGenerativeAI(apiKey || 'uninitialized');

// System instruction requested by user
const systemInstruction = `You are an expert coding interview coach and evaluator.

You must behave like a real interviewer.

Questioning rules:
- Ask only ONE question at a time.
- Match difficulty and topic strictly to the provided context.
- Stay within coding interview domain only.

Evaluation rules:
- When evaluating an answer, respond using this exact structure:

Result: Correct / Partially Correct / Incorrect

Feedback:
- Explain what is right/wrong
- Suggest improvement

Optimal Approach:
- Give better approach (if needed)

Complexity:
- Time Complexity: ...
- Space Complexity: ...

Next Step:
- Ask one follow-up question OR one next question

Tone rules:
- Be strict but encouraging.
- Keep answers clean, structured, and concise.
- Do not go out of interview scope.`;

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

    // Gemini API requires the history array to start with a 'user' message. 
    // In Mock mode, the first message is from the 'model', so we inject a user setup message.
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
       const setupMessage = isMock && mockContext 
         ? `Let's start the mock interview. I am interviewing for ${mockContext.role} and my skills are ${mockContext.skills}.` 
         : `Let's begin.`;
       formattedHistory.unshift({ role: 'user', parts: [{ text: setupMessage }]});
    }
    
    let evalMessage = latestMessageObj.content;
    
    if (isMock && mockContext) {
      evalMessage = `You are conducting a mock interview.

Candidate role: ${mockContext.role}
Skills: ${mockContext.skills}

User answer: ${evalMessage}

Do:
  - Evaluate answer strictly in the required structure.
  - Ask only one next/follow-up question.`;
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
    let resumeText = resume || '';

    // If a file was uploaded, extract its text based on mime type or extension
    if (req.file) {
      const buffer = req.file.buffer;
      const mimetype = req.file.mimetype;
      const originalname = req.file.originalname.toLowerCase();

      try {
        if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
          const pdfData = await pdfParse(buffer);
          resumeText = pdfData.text;
        } else if (
          mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          originalname.endsWith('.docx')
        ) {
          const mammothData = await mammoth.extractRawText({ buffer: buffer });
          resumeText = mammothData.value;
        } else {
          // Assume it's a plain text file as a fallback
          resumeText = buffer.toString('utf-8');
        }
      } catch (parseError) {
        console.error('Error parsing uploaded file:', parseError);
        return res.status(400).json({ error: 'Failed to extract text from the uploaded file.' });
      }
    }

    if (!role || !skills || !resumeText) {
      return res.status(400).json({ error: 'Missing role, skills, or resume.' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in server environment.' });
    }

    const prompt = `You are a technical interviewer.

Candidate details:
Role: ${role}
Skills: ${skills}
Resume:
${resumeText}

Start a mock interview:
- Ask the first question based on resume/projects
- Focus on role and skills
- Ask ONLY ONE question
- DO NOT INCLUDE ANY SCORE TAG FOR THE VERY FIRST QUESTION`;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      
      return res.status(200).json({ reply: result.response.text() });
    } catch (geminiError) {
      console.error('Gemini failed for /mock, using fallback question:', geminiError);
      return res.status(200).json({
        reply: buildFallbackMockQuestion(role, skills),
        fallback: true
      });
    }
  } catch (error) {
    console.error('Error with Gemini API /mock:', error);
    return res.status(500).json({ error: 'Failed to generate mock interview question' });
  }
};

const handlePracticeInit = async (req, res) => {
  try {
    const { topic, difficulty, type } = req.body;
    if (!topic || !difficulty || !type) {
      return res.status(400).json({ error: 'Missing topic, difficulty, or type.' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing.' });
    }

    let prompt = '';
    if (type === 'MCQ') {
      prompt = `Generate a ${difficulty} level ${topic} multiple choice question with 4 options and the correct answer. 
Please return ONLY valid JSON in this exact structure without any markdown formatting wrappers:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "The exact valid correct string representing the option"
}`;
    } else {
      prompt = `Generate a ${difficulty} level coding question on ${topic} with a description and example.
Please return ONLY valid JSON in this exact structure without any markdown formatting wrappers:
{
  "question": "The comprehensive question description including examples",
  "answer": "A brief conceptual solution or code placeholder"
}`;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    let textResult = result.response.text();

    // Clean up potential markdown wrapper from Gemini (e.g. ```json ... ```)
    textResult = textResult.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    
    const data = JSON.parse(textResult);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error generating practice question:', error);
    return res.status(500).json({ error: 'Failed to generate practice question' });
  }
};

const handlePracticeEvaluate = async (req, res) => {
  try {
    const { question, userAnswer } = req.body;
    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Missing question or user answer.' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing.' });
    }

    const prompt = `You are an expert coding interview evaluator.

  Evaluate the following user answer for the coding question below.
Question: ${question}
User Answer: ${userAnswer}

Provide evaluation strictly in this format:
  Result: <Correct or Partially Correct or Incorrect>

  Feedback:
  - Explain what is right/wrong
  - Suggest improvement

  Optimal Approach:
  - Give better approach (if needed)

  Complexity:
  - Time Complexity: ...
  - Space Complexity: ...

  Next Step:
  - Ask one follow-up question OR one next question`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    
    const text = result.response.text();
    let evaluationResult = 'Unknown';
    let feedback = text;

    if (text.toLowerCase().includes('result: correct')) {
      evaluationResult = 'Correct';
    } else if (text.toLowerCase().includes('result: partially correct')) {
      evaluationResult = 'Partially Correct';
    } else if (text.toLowerCase().includes('result: incorrect')) {
      evaluationResult = 'Incorrect';
    }

    // Attempt to extract purely feedback
    const feedbackMatch = text.match(/Feedback:\s*(.*)/is);
    if (feedbackMatch && feedbackMatch[1]) {
        feedback = feedbackMatch[1].trim();
    }

    return res.status(200).json({ result: evaluationResult, feedback });
  } catch(error) {
    console.error('Error evaluating practice answer:', error);
    return res.status(500).json({ error: 'Failed to evaluate practice answer' });
  }
};

module.exports = {
  handleChat,
  handleMockInit,
  handlePracticeInit,
  handlePracticeEvaluate,
};
