# API Specification

Base URL (local): http://localhost:3000

## 1. POST /api/auth/register
Create a new user account.

Request body:
```json
{
  "email": "student@example.com",
  "password": "secret123",
  "displayName": "Student"
}
```

Success 201:
```json
{
  "user": {
    "id": "171334...",
    "name": "Student",
    "email": "student@example.com",
    "picture": "https://...",
    "createdAt": "2026-04-17T..."
  },
  "token": "jwt_token"
}
```

Errors:
- 400 invalid input
- 409 account exists
- 500 server error

## 2. POST /api/auth/login
Authenticate existing user.

Request body:
```json
{
  "email": "student@example.com",
  "password": "secret123"
}
```

Success 200: same response shape as register.

## 3. POST /api/chat
Chat coaching endpoint.

Request body:
```json
{
  "history": [
    { "role": "user", "content": "hello" }
  ],
  "topic": "Arrays",
  "difficulty": "Medium",
  "isMock": false,
  "mockContext": null
}
```

Success 200:
```json
{
  "reply": "AI response text"
}
```

## 4. POST /api/mock
Initialize mock interview with resume.

Request type:
- multipart/form-data
- fields: role, skills, resumeFile

Success 200:
```json
{
  "reply": "First mock question",
  "fallback": false
}
```

## 5. POST /api/practice
Generate practice question.

Request body:
```json
{
  "topic": "Arrays",
  "difficulty": "Easy",
  "type": "MCQ"
}
```

Success 200 (MCQ):
```json
{
  "question": "...",
  "options": ["A","B","C","D"],
  "answer": "B"
}
```

Success 200 (Coding):
```json
{
  "question": "...",
  "answer": "Conceptual solution"
}
```

## 6. POST /api/practice/evaluate
Evaluate practice answer.

Request body:
```json
{
  "question": "...",
  "userAnswer": "..."
}
```

Success 200:
```json
{
  "result": "Correct",
  "feedback": "Detailed feedback"
}
```

## 7. Auth Header
Frontend sets Authorization: Bearer <token> via axios interceptor in api/client.js.
