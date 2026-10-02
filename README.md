# SpellCraft

SpellCraft is a React writing editor with a Python spell-checking API.

## Run locally

Start the API in one terminal:

```powershell
cd backend
.\venv\Scripts\python app.py
```

Start the frontend in another terminal:

```powershell
cd spellcraft\frontend
npm run dev
```

Open the local URL printed by Vite. During development, Vite proxies `/correct` to the Flask API on port 5000.

## Deploy to Vercel

This repository is configured as one Vercel project: the React app builds into Vercel's `public/` directory, and the Flask API runs as a Python Function.

1. Push the repository to GitHub.
2. In Vercel, import that repository and set **Root Directory** to the repository root (not `spellcraft/frontend`).
3. Leave the framework preset on **Other** or allow Vercel to detect Flask; keep the checked-in build/output settings.
4. Deploy. No environment variables are needed.

Vercel uses the root `app.py` entrypoint to load the Flask app from `backend/app.py`. The frontend calls `/correct` on the same origin, and the Python dependencies are listed in the root `requirements.txt`.