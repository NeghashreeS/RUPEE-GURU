import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Endpoints
  app.post("/api/health-score", async (req, res) => {
    try {
      const profile = req.body;
      const model = "gemini-3-flash-preview";
      const prompt = `Analyze this Indian financial profile and return a JSON object.
      Profile: ${JSON.stringify(profile)}
      
      Requirements:
      - Score (0-100)
      - Grade (Excellent, Good, Fair, Critical)
      - 3 Insights (one green/positive, one yellow/warning, one red/critical)
      - Top recommendation
      - Breakdown of scores for Savings, Debt, Emergency Fund, and Insurance.
      
      Use Indian context (INR, 80C, etc.).`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      res.json({ result: JSON.parse(response.text) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate health score" });
    }
  });

  app.post("/api/fire-plan", async (req, res) => {
    try {
      const { profile, retirementAge } = req.body;
      const model = "gemini-3-flash-preview";
      const prompt = `Create a FIRE (Financial Independence, Retire Early) plan for an Indian user.
      Profile: ${JSON.stringify(profile)}
      Target Retirement Age: ${retirementAge}
      
      Return a JSON object with:
      - targetCorpus (Total amount in INR)
      - monthlySipRequired (INR)
      - assetAllocation (Equity, Debt, Gold, Cash percentages)
      - strategy (3-4 bullet points)`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      res.json({ result: JSON.parse(response.text) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate FIRE plan" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const model = "gemini-3-flash-preview";
      
      const response = await ai.models.generateContent({
        model,
        contents: message,
        config: {
          systemInstruction: "You are Rupee Guru, a friendly Indian personal finance mentor. Use simple English, mention Indian schemes (PPF, NPS, SIP), and avoid jargon."
        }
      });

      res.json({ result: response.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
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
