# 🏋️‍♀️ Fitness Coach App

An intelligent **AI-powered fitness coach** built with **React.js** and **Google Gemini API** that generates personalized **training routines** and **diet plans** based on user preferences and fitness goals.

---

## 🚀 Features

- 💪 **Personalized Training Plan:**  
  Generates a full 7-day workout plan tailored to the user’s age, goal, and experience level.

- 🥗 **Smart Diet Recommendations:**  
  Suggests healthy meals with calorie and macro balance — fully aligned with the user’s dietary preference (Veg, Vegan, Non-Veg, Keto).

- 🤖 **Gemini AI Integration:**  
  Uses Google’s **Gemini API** to dynamically generate customized fitness plans in real time.

- 🌗 **Dark & Light Mode:**  
  Toggle between light and dark themes for a better user experience.

- 🔁 **Refresh & Reset Options:**  
  Easily refresh the plan or start over with a new set of preferences.

- 📥 **Download Option:**  
  Export your generated plan for offline reference.

- ⚡ **Fallback System:**  
  If Gemini API fails, the app automatically displays a sample default plan.

---

## 🧠 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **React.js** | Frontend framework |
| **Tailwind CSS / Lucide Icons** | UI styling and icons |
| **Google Gemini API** | AI-based plan generation |
| **Node.js (optional)** | Proxy backend (for API security) |
| **JavaScript (ES6)** | Core logic |

---

## 🗂️ Project Structure

fitness-coach-app/
│
├── src/
│ ├── FitnessCoachApp.jsx # Main React component
│ ├── geminiService.js # Handles Gemini API requests
│ ├── index.js # React entry point
│ └── App.css # Styling
│
├── public/
│ └── index.html
│
├── .env # Environment variables (API key)
├── package.json
└── README.md


## 🔑 Environment Setup

1. **Create a `.env` file** in the project root:
   ```bash
   REACT_APP_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
⚠️ Make sure there are no spaces or quotes around the key.
Restart the development server after adding the .env file.

###Install dependencies
In bash
npm install

###Run the app
In bash
npm start

###Access in browser
http://localhost:3000

###🧩 Gemini API Setup (Optional Backend Proxy)
To avoid CORS issues and keep your key safe, you can use a backend proxy.

Example (server.js):

js
Copy code
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
Then replace the Gemini call in geminiService.js with a fetch request to http://localhost:5000/api/generate.

###📋 How It Works
The user fills out personal data and preferences.

The app sends a prompt to the Gemini API with the user’s details.

Gemini returns a structured JSON response (plan + diet).

The app parses, validates, and displays it beautifully in the UI.

Users can toggle themes, download, or refresh the plan.

###🧩 Example Gemini Prompt
text
Copy code
Generate a detailed 7-day fitness and diet plan for a 25-year-old male,
goal: muscle gain, diet: vegan, experience: intermediate, workout at home.
Return JSON with "training" and "diet" fields only.
🩺 Example Output
json
Copy code
{
  "training": {
    "Monday": ["Push-ups", "Squats", "Plank"],
    "Tuesday": ["Jump rope", "Lunges", "Sit-ups"]
  },
  "diet": {
    "Breakfast": "Oats with almond milk and berries",
    "Lunch": "Quinoa salad with tofu and greens",
    "Dinner": "Lentil soup with brown rice"
  }
}
##🧑‍💻 Contributors
Ashwin S – Developer & Project Lead

Gemini API – AI content generation support

##🏁 Future Enhancements
🗣️ Voice-based AI trainer

🧘 Yoga & mindfulness recommendations

🕓 Daily progress tracker

☁️ Cloud sync with Firebase or Supabase

📱 Mobile app version (React Native)

