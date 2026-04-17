# Workflow, Logic, and Algorithms

## 1. Core User Workflows
### Workflow A: New User to First Mock Session
1. Register/Login
2. Open Mock Setup
3. Enter role + skills + upload resume
4. Backend parses resume and requests Gemini first question
5. User answers in ChatWindow
6. Session summary appears on End Session
7. Analytics and activity map are updated

### Workflow B: Practice Mode
1. Select topic, difficulty, question type
2. Request practice question
3. Submit answer (or timeout)
4. Receive correctness and feedback
5. Continue or end session

### Workflow C: Resume Previous Session
1. Dashboard shows Resume Last Session when history exists
2. App loads latest chat from user-scoped localStorage key
3. Restores topic, difficulty, mode, and chat transcript

## 2. State and Persistence Logic
### Per-user Storage Keys
- chatHistory:<userIdOrEmail>
- perfStats:<userIdOrEmail>
- activity:<userIdOrEmail>
- streak:<userIdOrEmail>

### Session Save Logic
- On message update, app either updates active chat or creates a new one.
- History sorted by latest timestamp.
- History limited to most recent 10 sessions.

### Streak Logic
- Compare today with lastActiveDate.
- +1 if consecutive day.
- Reset to 1 if gap > 1 day.

## 3. Algorithms
### 3.1 Average Score Update (incremental)
Given prior average A and total N, new score S:
- newTotal = N + 1
- newAvg = round((A*N + S) / newTotal)

### 3.2 Accuracy
- accuracy = round((score / maxQuestionsScore) * 100)

### 3.3 Yearly Heat Map Generation
- Build 53 week columns x 7 day rows = 371 cells.
- For each date cell:
  - key = YYYY-MM-DD
  - count = activityMap[key] || 0
- Assign color bucket by count:
  - 0, 1, 2, >=3
- Render month labels at week transitions.

## 4. AI Prompting Logic
### Chat Mode
- Uses strict systemInstruction.
- Converts assistant role to model role for Gemini history.
- Injects starter user message when history starts with model.

### Mock Mode
- Includes role and skills context on each answer evaluation.
- Enforces structured evaluator output.

### Practice Mode
- Prompts Gemini for strict JSON output for deterministic parsing.
