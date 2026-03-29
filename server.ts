import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory DB for demo
  const db = {
    goals: [
      { id: '1', title: 'Buy a Home', target: 5000000, current: 1200000, deadline: '2030-12-31' },
      { id: '2', title: 'New Car', target: 1500000, current: 450000, deadline: '2027-06-30' },
    ],
    history: {
      profiles: [] as any[],
      healthScores: [] as any[],
      firePlans: [] as any[],
    }
  };

  // Goal Endpoints
  app.get("/api/goals", (req, res) => {
    res.json(db.goals);
  });

  app.post("/api/goals", (req, res) => {
    const newGoal = { id: Date.now().toString(), ...req.body };
    db.goals.push(newGoal);
    res.json(newGoal);
  });

  // History Endpoints
  app.get("/api/history", (req, res) => {
    res.json(db.history);
  });

  app.post("/api/health-score/save", (req, res) => {
    const { profile, result } = req.body;
    db.history.profiles.push({ profile, result });
    res.json({ success: true });
  });

  app.post("/api/fire-plan/save", (req, res) => {
    const { profile, result } = req.body;
    db.history.firePlans.push({ profile, result });
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rupee Guru Backend running on http://localhost:${PORT}`);
  });
}

startServer();
