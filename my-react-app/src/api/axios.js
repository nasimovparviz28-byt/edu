import axios from 'axios';
import demoDatabase from '../../db.json';

const apiUrl = import.meta.env.VITE_API_URL?.trim();
const useBrowserDemo = import.meta.env.PROD && !apiUrl;
const demoStorageKey = 'edu-panel-demo-database';

function readDemoDatabase() {
  try {
    const stored = localStorage.getItem(demoStorageKey);
    if (stored) return JSON.parse(stored);
  } catch {
    localStorage.removeItem(demoStorageKey);
  }

  const initialData = structuredClone(demoDatabase);
  localStorage.setItem(demoStorageKey, JSON.stringify(initialData));
  return initialData;
}

function getDemoResource(path) {
  const [resource, id] = path.split('/').filter(Boolean);
  const database = readDemoDatabase();
  const rows = database[resource];
  if (!Array.isArray(rows)) throw new Error(`Unknown API resource: ${resource}`);
  return { database, resource, rows, id };
}

function demoGet(path, config = {}) {
  const { rows, id } = getDemoResource(path);
  if (id !== undefined) {
    const row = rows.find((item) => String(item.id) === id);
    if (!row) throw Object.assign(new Error('Not found'), { response: { status: 404 } });
    return Promise.resolve({ data: row });
  }

  const params = config.params || {};
  const data = rows.filter((row) => Object.entries(params).every(
    ([key, value]) => String(row[key]) === String(value)
  ));
  return Promise.resolve({ data });
}

function saveDemoDatabase(database) {
  localStorage.setItem(demoStorageKey, JSON.stringify(database));
}

function demoPost(path, payload) {
  const { database, rows } = getDemoResource(path);
  const nextId = rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
  const created = { ...payload, id: nextId };
  rows.push(created);
  saveDemoDatabase(database);
  return Promise.resolve({ data: created });
}

function demoPatch(path, payload) {
  const { database, rows, id } = getDemoResource(path);
  const index = rows.findIndex((item) => String(item.id) === id);
  if (index < 0) throw Object.assign(new Error('Not found'), { response: { status: 404 } });
  rows[index] = { ...rows[index], ...payload };
  saveDemoDatabase(database);
  return Promise.resolve({ data: rows[index] });
}

function demoDelete(path) {
  const { database, rows, resource, id } = getDemoResource(path);
  database[resource] = rows.filter((item) => String(item.id) !== id);
  saveDemoDatabase(database);
  return Promise.resolve({ data: {} });
}

const api = axios.create({
  baseURL: apiUrl || `http://${window.location.hostname}:3001`,
  headers: {
    'Content-Type': 'application/json'
  }
});

if (!useBrowserDemo) {
  api.interceptors.request.use((config) => {
    if (import.meta.env.PROD && !apiUrl) {
      const error = new Error('API_URL_NOT_CONFIGURED');
      error.code = 'API_URL_NOT_CONFIGURED';
      throw error;
    }

    return config;
  });
} else {
  api.get = (path, config) => demoGet(path, config);
  api.post = (path, payload) => demoPost(path, payload);
  api.patch = (path, payload) => demoPatch(path, payload);
  api.delete = (path) => demoDelete(path);
}

export default api;
