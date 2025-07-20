# 🌟 Saarthi AI – Empowering Digital Learning

Saarthi AI is an intelligent and accessible learning platform designed to empower learners of all backgrounds. It integrates structured video-based content, AI-driven assistance, smart quizzes, and personalized recommendations to guide users through digital literacy, coding, and vocational skills.

---

## 🚀 Features

✅ Chapter-wise video-based learning  
✅ AI Chatbot (local GPT-like chatbot using Ollama)  
✅ Career Mentor Bot (Gemini / LLM-based guidance)  
✅ Smart Quiz Practice System  
✅ Personalized ML-based feedback & recommendations  
✅ User authentication with signup/login system  
✅ Responsive, mobile-friendly design (Tailwind CSS)

---

## 📁 Project Structure

```bash
SaarthiAI/
│
├── controllers/               # Logic for API endpoints
│   ├── resourceController.js
│   └── userController.js
│
├── ml/                        # Future ML scripts (recommendations, feedback)
│   └── recommender.py
│
├── models/                    # MongoDB Mongoose schemas
│   ├── quiz.js
│   ├── quizResult.js
│   ├── resource.js
│   └── user.js
│
├── public/                    # Frontend HTML/CSS/JS
│   ├── assets/                # Images/icons
│   ├── index.html             # Homepage (subject selection)
│   ├── subject.html           # Chapter view
│   ├── video.html             # Video player with mark-as-read
│   ├── quiz.html              # Quiz page
│   ├── practice.html          # Quiz subject selector
│   ├── login.html             # Login page
│   ├── signup.html            # Signup page
│   ├── chatbot.html           # (Optional)
│   └── *.js                   # All frontend logic files
│
├── routes/                    # API routes
│   ├── careerMentorRoutes.js
│   ├── chatRoutes.js
│   ├── feedbackRoutes.js
│   ├── quizRoutes.js
│   ├── quizResultRoutes.js
│   ├── recommendationRoutes.js
│   ├── resourceroutes.js
│   └── userRoutes.js
│
├── .env                       # Environment variables (Mongo URI etc.)
├── .gitignore                 # node_modules, .env excluded
├── package.json               # NPM dependencies
└── server.js                  # Express backend entry point
🧠 ML & AI Features

Saarthi AI integrates various ML and AI-powered capabilities to enhance personalization, guidance, and user experience:

- 🤖 Ask AI Chatbot  
  Built using a locally running GPT-like LLM via Ollama (e.g., Mistral or Gemma), this chatbot answers learner queries in real time.

- 🎯 Career Mentor Chatbot  
  Uses Gemini API (Google's LLM) to offer personalized career and learning guidance based on user goals and interests.

- ✅ Smart Quiz Feedback System  
  After each quiz attempt, the platform analyzes user responses and provides insights like:
  - Strong topics
  - Weak areas
  - Recommended chapters/videos to review

- 📊 ML-Based Recommendation Engine  
  Suggests videos based on user progress and quiz performance. Learners get “Recommended Next” content tailored to their learning path.

-
