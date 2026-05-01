# 🏋️ Gym Buddy — AI-Powered Fitness Concierge

> **No Excuses. Just Execution.**

Gym Buddy is a premium AI-powered fitness platform featuring **Genki**, your relentless, data-driven anime-style personal coach. Built with Next.js 16 and powered by Google Gemini 2.5 Flash, it delivers personalized 7-day workout roadmaps, real-time nutritional analysis, and intelligent muscle recovery tracking — all in one sleek, futuristic dashboard.

---

## ✨ Features

### 🧠 Genki AI Coach
- Powered by **Google Gemini 2.5 Flash** via the `@google/genai` SDK
- Generates structured **7-day training split roadmaps** tailored to your biometrics and muscle readiness
- Personality: strict, data-driven, and motivating — *"Biological assets optimized."*

### 📊 Dynamic Routine Engine
- Intelligently adapts exercises based on muscle readiness percentages:
  - **80–100%** → Heavy compound movements (5×5 Deadlifts, Barbell Squats, etc.)
  - **60–79%** → Moderate hypertrophy work (3×12 Dumbbell Press, Cable Rows, etc.)
  - **Below 60%** → Light recovery exercises only; heavy day swapped to a higher-readiness group
- Enforces a **Day 3 Rule**: full Rest if all muscles are above 60%, Active Recovery otherwise
- Includes a **fallback roadmap** generated offline if the AI API is unavailable

### 📡 AI Kinetic Vision (Body Scanner)
- Input your **weight, height, age, and gender**
- Calculates real-time **BMI**, **BMR** (Basal Metabolic Rate), and **TDEE** (Total Daily Energy Expenditure)
- Estimates your **Biological Age** for performance benchmarking

### 🥗 Nutritional Synthesis
- Log any meal (text input) and receive instant **AI-generated nutritional feedback**
- Automatic **macro target recommendations** (Protein / Carbs / Fats) based on your BMI profile:
  - Underweight → **Bulking Protocol**
  - Overweight → **Cutting Protocol**
  - Normal → **Balanced Performance**
- Displays Genki's metabolic insight alongside your BMR/TDEE

### 💪 Muscle Readiness (Manual Override)
- Interactive **bar chart + slider UI** for 6 muscle groups: Chest, Back, Legs, Arms, Core, Shoulders
- Adjusting sliders auto-triggers a new AI roadmap (debounced at 1.5s)
- **Recovery Concierge**: alerts you when critical fatigue is detected and prescribes a recovery protocol

### 🏆 Wealthy Health Score
- A composite wellness score displayed in the dashboard header
- Animated counter updates whenever your data changes

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles & design tokens
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard (Bento grid UI)
│   │   └── layout.tsx            # Dashboard layout with Sidebar
│   └── api/
│       ├── coach/route.ts        # POST /api/coach — AI roadmap generation
│       ├── kinetics/             # Body metrics analysis endpoint
│       └── nutrition/            # Meal nutritional analysis endpoint
├── components/
│   ├── BentoCard.tsx             # Reusable glass-card component
│   └── Sidebar.tsx               # Navigation sidebar with Genki chat
└── context/
    └── GenkiContext.tsx          # Global state (biometrics, roadmap, AI calls)
```

---

## 🛠️ Tech Stack

| Category        | Technology                              |
|-----------------|-----------------------------------------|
| Framework       | [Next.js 16](https://nextjs.org/) (App Router) |
| Language        | TypeScript 5                            |
| AI / LLM        | Google Gemini 2.5 Flash (`@google/genai`) |
| Styling         | Tailwind CSS v4                         |
| Animations      | Framer Motion 12                        |
| Icons           | Lucide React                            |
| Deployment      | Vercel                                  |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **Google Gemini API key** → [Get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gym-buddy.git
cd gym-buddy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Never commit your `.env.local` file.** It is already listed in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

1. **Landing Page** — Click *"Start Training"* to enter the Command Center.
2. **AI Kinetic Vision** — Enter your weight, height, age, and gender, then click *"Sync & Analyze"* to compute your biometrics and generate an initial roadmap.
3. **Muscle Readiness** — Use the sliders to manually set recovery percentages for each muscle group. The AI will automatically regenerate your roadmap.
4. **Dynamic Routine Engine** — View your personalized 7-day training plan with day-by-day focus and exercises.
5. **Nutritional Synthesis** — Type a meal description and click *"Analyze"* to receive macro feedback from Genki.
6. **Sidebar Chat** — Ask Genki anything directly for on-demand coaching advice.

---

## 🔌 API Endpoints

| Method | Endpoint           | Description                                     |
|--------|--------------------|-------------------------------------------------|
| `POST` | `/api/coach`       | Generates a 7-day AI workout roadmap            |
| `POST` | `/api/kinetics`    | Analyzes biometrics (BMI, BMR, TDEE, Bio-Age)   |
| `POST` | `/api/nutrition`   | Analyzes a meal and returns nutritional feedback |

### `/api/coach` Request Body

```json
{
  "input": "Generate a roadmap based on my current stats",
  "bmi": 22.5,
  "bmr": 1750,
  "muscleReadiness": [
    { "name": "Chest", "recovery": 85 },
    { "name": "Back", "recovery": 70 },
    { "name": "Legs", "recovery": 55 },
    { "name": "Arms", "recovery": 90 },
    { "name": "Core", "recovery": 75 },
    { "name": "Shoulders", "recovery": 80 }
  ]
}
```

---

## 🏗️ Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🚢 Deployment

This project is optimized for deployment on **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Add your `GEMINI_API_KEY` in the Vercel dashboard under **Project Settings → Environment Variables**.

---

## 📄 License

This project is for personal and educational use. All rights reserved.

---

<div align="center">
  <strong>Built with ⚡ by Leo Anggoro</strong><br/>
  <em>Powered by Google Gemini · Deployed on Vercel</em>
</div>
