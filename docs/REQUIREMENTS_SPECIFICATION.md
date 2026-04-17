# Software Requirements Specification (SRS)

## 1. Introduction
### 1.1 Purpose
CodePilot AI is an AI-assisted interview preparation platform that provides mock interviews, topic-based chat coaching, and practice question evaluation. This document defines requirements for development, verification, and project submission.

### 1.2 Scope
The system enables users to:
- Register and log in with email/password.
- Run mock interviews using role, skills, and resume context.
- Practice coding and MCQ questions with AI evaluation.
- Track sessions, performance, streaks, and date-wise activity.
- Resume previous sessions from history.

### 1.3 Definitions
- Mock Interview: Resume/role-driven interview conversation with one-question-at-a-time flow.
- Practice Mode: AI-generated MCQ or coding question flow with per-question evaluation.
- Session: A bounded conversation/practice attempt ending when user clicks End Session.

## 2. Overall Description
### 2.1 Product Perspective
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- AI Provider: Google Gemini API
- Storage: Browser localStorage + backend JSON user file

### 2.2 User Classes
- Candidate/Student: Primary user practicing technical interviews.
- Reviewer/Instructor: Secondary user reading analytics and session quality.

### 2.3 Operating Environment
- Browser: Latest Chrome/Edge/Firefox
- Node.js: v18+ recommended
- OS: Windows/Linux/macOS supported for development

### 2.4 Constraints
- LocalStorage only for analytics and chat history persistence.
- No relational database.
- Backend currently single-instance file-based user store.

## 3. Functional Requirements
### FR-01 Authentication
- System shall allow email/password registration.
- System shall allow email/password login.
- System shall return JWT and sanitized user payload.

### FR-02 Mock Interview Initialization
- System shall accept role, skills, and resume file/text.
- System shall parse PDF/DOCX/TXT and extract text.
- System shall generate first interview question.
- System shall provide fallback question on model failure.

### FR-03 Chat Coaching
- System shall accept message history and latest user message.
- System shall return a structured AI reply.
- System shall enforce one-question-at-a-time behavior via system prompt.

### FR-04 Practice Question Generation
- System shall generate MCQ or coding question by topic/difficulty.
- System shall return machine-readable JSON for frontend rendering.

### FR-05 Practice Evaluation
- System shall evaluate user answer and return result + feedback.

### FR-06 Session Reporting
- On End Session, system shall show score, accuracy, strengths, weak areas, suggested topics.

### FR-07 User Analytics
- System shall maintain per-user localStorage analytics:
  - totalSessions
  - avgScore
  - lastScore
  - lastAccuracy
  - lastTopic
  - activity map
  - streak

### FR-08 Streak and Date-wise Heat Map
- System shall track daily activity.
- System shall update streak based on consecutive active days.
- System shall render a yearly date-wise heat map with hover details.

### FR-09 Session Resume
- System shall allow resuming the most recent session from dashboard.

## 4. Non-Functional Requirements
### NFR-01 Usability
- UI shall provide clear empty states, mode badges, and loading feedback.

### NFR-02 Performance
- Frontend production build shall complete successfully.
- API responses should be acceptable for interactive chat UX.

### NFR-03 Reliability
- APIs shall return explicit error payloads on failures.
- Fallback behavior shall exist for mock start when Gemini fails.

### NFR-04 Security
- Passwords shall be hashed with bcrypt.
- JWT-based auth for client session tokening.
- Secrets shall be read from environment variables.

## 5. External Interface Requirements
### 5.1 API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/chat
- POST /api/mock
- POST /api/practice
- POST /api/practice/evaluate

### 5.2 Frontend Routes/Views
- Login
- Dashboard
- Chat
- Mock Setup
- Practice
- Profile

## 6. Acceptance Criteria
- User can register/login and start all modes.
- Session summary appears at session end.
- Dashboard displays analytics and resume option.
- Profile shows yearly date-wise heat map with hover info.
- Frontend build passes.
- Backend starts on available port.
