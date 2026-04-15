import { Dataset, Model } from "../types";

export async function fetchDatasets(): Promise<Dataset[]> {
  const res = await fetch("/api/datasets");
  return res.json();
}

export async function saveDataset(dataset: Partial<Dataset>): Promise<Dataset> {
  const res = await fetch("/api/datasets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataset),
  });
  return res.json();
}

export async function fetchModels(): Promise<Model[]> {
  const res = await fetch("/api/models");
  return res.json();
}

export async function saveModel(model: Partial<Model>): Promise<Model> {
  const res = await fetch("/api/models", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(model),
  });
  return res.json();
}
