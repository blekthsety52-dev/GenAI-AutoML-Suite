import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATASETS_FILE = path.join(DATA_DIR, "datasets.json");
const MODELS_FILE = path.join(DATA_DIR, "models.json");
const PREDICTIONS_FILE = path.join(DATA_DIR, "predictions.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    for (const file of [DATASETS_FILE, MODELS_FILE, PREDICTIONS_FILE]) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, JSON.stringify([]));
      }
    }
  } catch (error) {
    console.error("Error creating data directory:", error);
  }
}

ensureDataDir();

export async function readData(file: string) {
  const content = await fs.readFile(file, "utf-8");
  return JSON.parse(content);
}

export async function writeData(file: string, data: any) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}
