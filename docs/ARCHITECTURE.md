# Architecture and Diagrams

## 1. High-Level Architecture
```mermaid
flowchart LR
    U[User Browser] --> FE[React Frontend]
    FE -->|HTTP JSON| BE[Express Backend]
    BE -->|Prompt/Response| G[Gemini API]
    BE --> UF[(users.json)]
    FE --> LS[(localStorage)]
```

## 2. Component View
```mermaid
flowchart TB
    subgraph Frontend
      APP[App.jsx]
      SIDEBAR[Sidebar]
      DASH[Dashboard]
      CHAT[ChatWindow]
      MOCK[MockInterviewSetup]
      PRACTICE[PracticeMode]
      PROFILE[Profile]
      API[api/client.js]
    end

    subgraph Backend
      SERVER[server.js]
      AR[authRoutes]
      CR[chatRoutes]
      AC[authController]
      CC[chatController]
      US[userStore]
    end

    APP --> SIDEBAR
    APP --> DASH
    APP --> CHAT
    APP --> MOCK
    APP --> PRACTICE
    APP --> PROFILE
    CHAT --> API
    MOCK --> API
    PRACTICE --> API
    API --> SERVER
    SERVER --> AR
    SERVER --> CR
    AR --> AC
    CR --> CC
    AC --> US
```

## 3. Mock Interview Sequence
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Gemini

    User->>Frontend: Fill role/skills + upload resume
    Frontend->>Backend: POST /api/mock (multipart)
    Backend->>Backend: Parse PDF/DOCX/TXT
    Backend->>Gemini: Generate first question
    Gemini-->>Backend: First question
    Backend-->>Frontend: reply (+fallback flag if needed)
    Frontend-->>User: Show first mock question
```

## 4. Chat Evaluation Sequence
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Gemini

    User->>Frontend: Submit answer
    Frontend->>Backend: POST /api/chat (history + mode context)
    Backend->>Backend: Validate/transform history
    Backend->>Gemini: sendMessage
    Gemini-->>Backend: Structured response
    Backend-->>Frontend: reply
    Frontend-->>User: Render coaching response
```

## 5. Deployment Notes
- Frontend static assets: Vite build output in frontend/dist.
- Backend runtime: Node + Express service.
- Configuration: GEMINI_API_KEY, JWT_SECRET, PORT.
- Current local default ports: backend 3000, frontend 5173 (or next available).
