export interface Dataset {
  id: string;
  name: string;
  description: string;
  rowCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  schema: string[];
}

export interface Model {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  datasetId?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  version: string;
}

export interface Prediction {
  id: string;
  modelId: string;
  input: string;
  output: string;
  latency: number;
  createdAt: string;
  userId: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
}
