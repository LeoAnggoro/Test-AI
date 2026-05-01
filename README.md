# 🏋️ Gym Buddy — AI-Powered Fitness Concierge

<div align="center">

> **No Excuses. Just Execution.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)

Gym Buddy is a premium AI-powered fitness platform featuring **Genki**, your relentless, data-driven anime-style personal coach. Built with Next.js 16 and powered by Google Gemini 2.5 Flash, it delivers personalized 7-day workout roadmaps, real-time nutritional analysis, and intelligent muscle recovery tracking — all in one sleek, futuristic dashboard.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Genki AI Coach** | Strict, motivating AI coach powered by Gemini 2.5 Flash |
| 📊 **Dynamic Routine Engine** | Auto-generates 7-day split based on your muscle readiness |
| 📡 **AI Kinetic Vision** | Calculates BMI, BMR, TDEE, and Biological Age from your stats |
| 🥗 **Nutritional Synthesis** | AI meal analysis with macro targets (Bulk / Cut / Balance) |
| 💪 **Muscle Readiness** | Interactive sliders for 6 muscle groups with recovery alerts |
| 🏆 **Wealthy Health Score** | Composite wellness score updated in real-time |

### 📊 Dynamic Routine Engine — Intensity Logic

| Readiness | Training Protocol |
|---|---|
| **80–100%** | Heavy compound movements (e.g., 5×5 Deadlifts, Barbell Squats) |
| **60–79%** | Moderate hypertrophy work (e.g., 3×12 Dumbbell Press, Cable Rows) |
| **Below 60%** | Light recovery only; heavy day swapped to a higher-readiness group |

> **Day 3 Rule:** Full Rest if all muscles are above 60%, Active Recovery otherwise.

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

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) — App Router |
| Language | TypeScript 5 |
| AI / LLM | Google Gemini 2.5 Flash (`@google/genai`) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **Google Gemini API key** — [Get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/LeoAnggoro/Test-AI.git
cd Test-AI
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

> ⚠️ **Never commit your `.env.local` file.** It is already included in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

1. **Landing Page** — Click *"Start Training"* to enter the Command Center.
2. **AI Kinetic Vision** — Enter your stats and click *"Sync & Analyze"* to compute biometrics and generate an initial roadmap.
3. **Muscle Readiness** — Adjust the sliders per muscle group; the AI auto-regenerates your roadmap after 1.5s.
4. **Dynamic Routine Engine** — View your personalized 7-day plan with focus areas and exercises.
5. **Nutritional Synthesis** — Type a meal description and click *"Analyze"* for Genki's macro feedback.
6. **Sidebar Chat** — Ask Genki anything for on-demand coaching advice.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/coach` | Generates a 7-day AI workout roadmap |
| `POST` | `/api/kinetics` | Analyzes biometrics (BMI, BMR, TDEE, Bio-Age) |
| `POST` | `/api/nutrition` | Analyzes a meal and returns nutritional feedback |

<details>
<summary><strong>📋 /api/coach — Example Request Body</strong></summary>

```json
{
  "input": "Generate a roadmap based on my current stats",
  "bmi": 22.5,
  "bmr": 1750,
  "muscleReadiness": [
    { "name": "Chest",     "recovery": 85 },
    { "name": "Back",      "recovery": 70 },
    { "name": "Legs",      "recovery": 55 },
    { "name": "Arms",      "recovery": 90 },
    { "name": "Core",      "recovery": 75 },
    { "name": "Shoulders", "recovery": 80 }
  ]
}
```

</details>

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

This project is optimized for **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LeoAnggoro/Test-AI)

After deploying, add your `GEMINI_API_KEY` under **Project Settings → Environment Variables** in the Vercel dashboard.

---

## 📄 License

This project is for personal and educational use. All rights reserved.

---

<div align="center">
  <strong>Built with ⚡ by Leo Anggoro</strong><br/>
  <em>Powered by Google Gemini · Deployed on Vercel</em>
</div>
