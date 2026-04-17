# Metrics and Quality Report

## 1. Build and Runtime Checks
Date: 2026-04-17

### Frontend
- Command: npm run build
- Result: PASS
- Output summary:
  - dist/index.html 0.89 kB
  - dist/assets/index-BVfTawdr.css 43.16 kB
  - dist/assets/index-DPG-fLyJ.js 370.48 kB

### Backend
- Command: npm run dev on port 3000
- Result: FAIL due to EADDRINUSE
- Root cause: existing node process already bound to port 3000

### Backend Alternate Port Validation
- Command: PORT=3001 node server.js
- Result: PASS (server starts on port 3001)

### Port Diagnostics
- Port 3000: LISTEN by node process (PID 7984)
- Port 5173: LISTEN by node process (PID 3148)
- Port 5174: LISTEN by node process (PID 1144)

## 2. Functional Coverage Summary
- Authentication: register/login with validation and hashed passwords
- Mock interview: resume parsing + first-question generation + fallback
- Chat mode: contextual coaching and structured feedback
- Practice mode: question generation + evaluation
- Session summary: score/accuracy/strength/weak areas/recommendation
- Dashboard metrics: sessions, average score, last score/accuracy/topic
- Streak tracking: daily consecutive-day logic
- Profile analytics: yearly date-wise heat map with hover details

## 3. Risks and Mitigations
### Risk: Port collisions in local runs
- Mitigation: set backend PORT explicitly (example 3001)
- Mitigation: stop stale node processes before running dev commands

### Risk: LocalStorage inconsistency if keys changed
- Mitigation: use per-user namespaced keys consistently

### Risk: Gemini malformed JSON in practice generation
- Mitigation: markdown wrapper stripping and JSON parse guard

## 4. Recommended Final Pre-Submission Steps
1. Stop old node processes on ports 3000/5173/5174.
2. Start backend on intended port.
3. Start frontend and verify API base URL.
4. Smoke test all major flows (auth, mock, practice, profile heat map, resume session).
5. Capture screenshots for report submission.
