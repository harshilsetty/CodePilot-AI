# Operational Runbook

## 1. Runtime Startup
1. Start backend service:
   - cd backend
   - npm run dev
2. Start frontend service:
   - cd frontend
   - npm run dev
3. Access web client:
   - http://localhost:5173

## 2. Port Collision Handling
PowerShell cleanup command:
- $ports = 3000,5173,5174
- $conns = Get-NetTCPConnection -LocalPort $ports -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
- $processIds = $conns | Select-Object -ExpandProperty OwningProcess -Unique
- foreach ($procId in $processIds) { Stop-Process -Id $procId -Force }

Alternative backend startup port:
- PowerShell: $env:PORT=3001; npm run dev

## 3. Functional Validation Flow
1. Authentication:
   - Validate register and login.
2. Dashboard:
   - Validate metrics visibility and session resume behavior.
3. Mock interview:
   - Validate role/skills/resume initialization and first-question generation.
4. Chat workflow:
   - Validate response generation and session summary rendering.
5. Practice workflow:
   - Validate question generation and answer evaluation.
6. Profile analytics:
   - Validate yearly heat map rendering and hover detail card.

## 4. Technical Reference Notes
- Frontend stack: React, Vite, Tailwind CSS.
- Backend stack: Node.js, Express, modular route/controller architecture.
- AI integration: Gemini API with structured prompt contracts.
- Persistence model: per-user localStorage namespaces and backend JSON user store.
- Resilience strategy: fallback path for mock interview initialization.

## 5. Artifact Index
- README.md
- docs/REQUIREMENTS_SPECIFICATION.md
- docs/REQUIREMENTS_SPECIFICATION.docx
- docs/ARCHITECTURE.md
- docs/API.md
- docs/WORKFLOWS_ALGOS.md
- docs/METRICS_QUALITY.md
- docs/RELEASE_READINESS_CHECKLIST.md
- docs/OPERATIONAL_RUNBOOK.md
