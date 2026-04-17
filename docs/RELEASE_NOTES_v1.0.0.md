## CodePilot AI v1.0.0

Initial production-grade release of CodePilot AI with authenticated interview workflows, analytics, profile insights, and comprehensive engineering documentation.

### Highlights
- Added email/password authentication with JWT support.
- Added mock interview mode with role, skills, and resume-driven context.
- Added practice mode for MCQ and coding question workflows with AI evaluation.
- Added structured end-session summary (score, accuracy, strengths, weak areas, recommendation).
- Added per-user chat history persistence and Resume Last Session flow.
- Added dashboard analytics (sessions, average score, last score, last accuracy, last topic).
- Added daily streak logic and yearly date-wise profile heat map with hover details.
- Refactored UI theme to a modern AI-SaaS identity with glassmorphism and improved interactions.
- Added complete documentation set:
  - Requirements specification (MD + DOCX)
  - Architecture and sequence diagrams
  - API specification
  - Workflow and algorithm references
  - Metrics and quality report
  - Release readiness checklist
  - Operational runbook

### Validation Summary
- Frontend production build: PASS
- Backend syntax checks: PASS
- Backend runtime check (alternate port): PASS
- Diagnostics: No errors detected

### Notes
- If local port collisions occur, run backend on an alternate port:
  - PowerShell: `$env:PORT=3001; npm run dev`
