import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { readData, writeData } from "./src/lib/storage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASETS_FILE = path.join(process.cwd(), "data", "datasets.json");
const MODELS_FILE = path.join(process.cwd(), "data", "models.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Datasets
  app.get("/api/datasets", async (req, res) => {
    try {
      const data = await readData(DATASETS_FILE);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to read datasets" });
    }
  });

  app.post("/api/datasets", async (req, res) => {
    try {
      const datasets = await readData(DATASETS_FILE);
      const newDataset = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
      datasets.push(newDataset);
      await writeData(DATASETS_FILE, datasets);
      res.json(newDataset);
    } catch (err) {
      res.status(500).json({ error: "Failed to save dataset" });
    }
  });

  // Models
  app.get("/api/models", async (req, res) => {
    try {
      const data = await readData(MODELS_FILE);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to read models" });
    }
  });

  app.post("/api/models", async (req, res) => {
    try {
      const models = await readData(MODELS_FILE);
      const newModel = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
      models.push(newModel);
      await writeData(MODELS_FILE, models);
      res.json(newModel);
    } catch (err) {
      res.status(500).json({ error: "Failed to save model" });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
