# Deployment Guide (Prototype)

This guide deploys CodePilot AI so it is accessible from anywhere.

## Recommended Stack
- Frontend: Vercel (React + Vite static hosting)
- Backend: Render (Node.js web service)

## 1. Deploy Backend on Render

### Option A: Blueprint (using render.yaml)
1. Push latest code to GitHub.
2. In Render dashboard, choose New > Blueprint.
3. Select repository: harshilsetty/CodePilot-AI.
4. Render reads `render.yaml` and creates service `codepilot-ai-backend`.
5. Set required environment variables in Render:
   - GEMINI_API_KEY
   - JWT_SECRET
   - CORS_ORIGINS (set to frontend URL after Vercel deploy)
6. Deploy and copy backend URL (example: `https://codepilot-ai-backend.onrender.com`).

### Option B: Manual service setup
1. New > Web Service.
2. Root directory: `backend`.
3. Build command: `npm install`.
4. Start command: `npm run dev`.
5. Add same environment variables as above.

## 2. Deploy Frontend on Vercel
1. Import GitHub repo into Vercel.
2. Set project root to `frontend`.
3. Framework preset: Vite.
4. Add environment variable:
   - `VITE_API_BASE_URL=https://<your-render-backend-url>`
5. Deploy and copy frontend URL.

## 3. Configure Backend CORS
Set Render env var:
- `CORS_ORIGINS=https://<your-vercel-frontend-url>`

If multiple domains are needed, use comma-separated values:
- `CORS_ORIGINS=https://app.example.com,https://staging.example.com`

Redeploy backend after CORS update.

## 4. Post-Deploy Verification
1. Open frontend URL.
2. Register and login.
3. Start mock interview and verify API responses.
4. Start practice mode and verify generation/evaluation.
5. Verify dashboard analytics and profile heat map.

## 5. Useful Notes
- Free tiers may sleep due to inactivity.
- Keep API keys only in platform env vars, never hardcode in source.
- Frontend rewrite config is included in `frontend/vercel.json` for SPA routing.
