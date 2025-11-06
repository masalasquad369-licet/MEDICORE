MedicoRe Project - Local Demo (Chennai)

Structure:
- backend/      -> Node.js backend (Express) that calls Gemini via @google-generativeai
- frontend/     -> Modified MedicoRe UI (index.html) that calls backend at http://localhost:5000/analyze

Setup (local):
1) Backend:
   cd backend
   npm install
   # Edit .env and set GEMINI_API_KEY=your_real_api_key_here
   npm start
   (server will listen on http://localhost:5000)

2) Frontend:
   Serve the frontend folder over a local static server (do NOT open index.html via file://)
   Options:
     - Using Python 3: cd frontend && python3 -m http.server 8000
       Then open http://localhost:8000 in your browser
     - Using Node (npm): npx serve frontend
     - Using VSCode Live Server extension

Notes:
- This is a demo. The AI suggestions are for informational purposes only — NOT medical advice.
- Replace GEMINI_API_KEY in backend/.env with your actual key before calling the analyze feature.
- Nominatim (OpenStreetMap) is used for hospital search; respect usage limits for heavy use.

Default city for hospital search: Chennai, India
