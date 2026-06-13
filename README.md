# ⚡ SetEdge — Tennis & Table Tennis Prediction Engine

> Daily Over/Under and Set Winner predictions powered by Elo ratings, recent form, and head-to-head analysis. Built for zero-config deployment on **Vercel**.

---

## 🎯 What It Does

Every day at **06:00 UTC**, a Vercel Cron Job automatically:

1. Fetches today's Tennis and Table Tennis fixtures
2. Runs the prediction engine (Elo + Form + H2H + Surface)
3. Generates Over/Under and Set Winner predictions
4. Saves results as JSON
5. Serves predictions to the React dashboard

---

## 📊 Prediction Markets

| Market | Examples |
|--------|----------|
| **Over/Under** | Over 3.5 Sets, Under 2.5 Sets, Over 4.5 Sets |
| **Set Winner** | Carlos Alcaraz – First Set, Ma Long – Second Set |

### Confidence Tiers

| Tier | Range | Color |
|------|-------|-------|
| 🔥 Elite | 90–100% | Amber |
| ✅ High | 80–89% | Green |
| 📊 Medium | 70–79% | Blue |
| _(ignored)_ | < 70% | — |

---

## 🧠 Prediction Engine

```
Elo Rating         → Win probability per player
Surface Elo        → Hard / Clay / Grass / Indoor (Tennis)
Recent Form        → Last 5 matches, weighted by recency
Head-to-Head       → Match history, set averages, dominance
Set Statistics     → Avg sets played, sets won/lost ratio
```

No machine learning. No neural networks. Pure statistical analysis.

---

## 🚀 Deployment

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/setedge.git
cd setedge
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local:
#   RAPIDAPI_KEY=your-key     (optional — uses mock data if empty)
#   CRON_SECRET=your-secret
```

### 3. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Deploy to Vercel

```bash
# Option A: Vercel CLI
npx vercel --prod

# Option B: Connect GitHub repo in vercel.com dashboard
```

Set environment variables in **Vercel → Settings → Environment Variables**:
- `RAPIDAPI_KEY`
- `CRON_SECRET`

The cron job in `vercel.json` runs automatically at 06:00 UTC daily.

---

## 📁 Project Structure

```
setedge/
├── app/
│   ├── api/
│   │   ├── cron/run-predictions/route.ts  ← Daily cron job
│   │   └── predictions/[sport]/route.ts   ← Data API
│   ├── components/
│   │   ├── Dashboard.tsx       ← Main client component
│   │   ├── PredictionCard.tsx  ← Individual prediction card
│   │   ├── ConfidenceBadge.tsx ← Confidence indicator
│   │   ├── ConfidenceFilters.tsx
│   │   ├── SportTabs.tsx
│   │   ├── StatsBar.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── EmptyState.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── types.ts              ← All TypeScript types
│   ├── elo.ts                ← Elo rating engine
│   ├── form.ts               ← Recent form analyser
│   ├── h2h.ts                ← Head-to-head engine
│   ├── prediction-engine.ts  ← Main prediction logic
│   ├── fetcher.ts            ← API/mock fixture fetcher
│   └── storage.ts            ← JSON file I/O
├── scripts/
│   ├── fetch-fixtures.ts     ← Manual fixture fetch
│   └── generate-predictions.ts ← Manual prediction run
├── outputs/
│   ├── tennis.json           ← Tennis predictions cache
│   └── table-tennis.json     ← Table Tennis predictions cache
├── vercel.json               ← Cron configuration
└── .env.example
```

---

## 🔌 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/predictions/tennis` | GET | Tennis predictions JSON |
| `/api/predictions/table-tennis` | GET | Table Tennis predictions JSON |
| `/api/cron/run-predictions` | GET | Trigger prediction pipeline (cron) |

---

## 🛠️ Manual Scripts

```bash
# Fetch fixtures only
npm run fetch-fixtures

# Run full prediction pipeline
npm run generate-predictions
```

---

## 🔑 API Data Source

Uses **API-Sports** via RapidAPI:
- https://rapidapi.com/api-sports/api/api-tennis

**Without a key**: rich mock data is used automatically — perfect for development and demos.

---

## ➕ Adding a New Sport

1. Add sport type to `lib/types.ts`
2. Add mock/fetch logic in `lib/fetcher.ts`
3. Tune prediction thresholds in `lib/prediction-engine.ts`
4. Add tab in `app/components/SportTabs.tsx`
5. Run cron will auto-include it

---

## 📝 License

MIT — build, fork, deploy freely.
