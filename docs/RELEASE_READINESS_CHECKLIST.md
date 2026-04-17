# Release Readiness Checklist

## 1. Build and Runtime
- [ ] Frontend production build succeeds.
- [ ] Backend service starts on target port.
- [ ] Frontend and backend run with aligned API base URL.
- [ ] No active diagnostics errors in application source.

## 2. Functional Validation
- [ ] Authentication register and login flows pass.
- [ ] Mock interview initialization passes with resume parsing.
- [ ] Chat interaction and session summary workflow pass.
- [ ] Practice mode generation and evaluation pass.
- [ ] Dashboard analytics and session resume pass.
- [ ] Streak and yearly heat map analytics pass.

## 3. API Validation
- [ ] /api/auth/register
- [ ] /api/auth/login
- [ ] /api/chat
- [ ] /api/mock
- [ ] /api/practice
- [ ] /api/practice/evaluate

## 4. Documentation Completeness
- [ ] README is current.
- [ ] Requirements specification is current.
- [ ] Architecture documentation is current.
- [ ] API specification is current.
- [ ] Workflow/algorithm documentation is current.
- [ ] Quality and metrics report is current.
- [ ] Operational runbook is current.

## 5. Release Package Contents
- [ ] Source code repository
- [ ] docs directory
- [ ] Optional requirements specification DOCX
