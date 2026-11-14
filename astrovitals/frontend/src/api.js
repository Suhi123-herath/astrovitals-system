// Without API_URL: demo data in localStorage. With API_URL: Spring Boot REST API.
import { seedMission } from './engine.js';

const BASE = process.env.API_URL;
const KEY = 'astrovitals.v1';
const DEMO_KEY = 'astrovitals.judge-demo.v1';
const ID = 1;

let demoMode = false;

export let REMOTE = Boolean(BASE);

// Demo mode always uses isolated browser storage.
// It never reads or writes the shared backend.
export function setDemoMode(enabled) {
  demoMode = Boolean(enabled);
  REMOTE = Boolean(BASE) && !demoMode;
}

const storageKey = () => demoMode ? DEMO_KEY : KEY;

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey())) || [];
  } catch {
    return [];
  }
};

const save = (data) => {
  localStorage.setItem(storageKey(), JSON.stringify(data));
};

// Give judges a preloaded dashboard on their first visit.
export function initializeDemoData() {
  if (!demoMode) return;

  const existing = load();

  if (existing.length === 0) {
    save(seedMission());
  }
}

async function checkedFetch(url, options) {
  let r;
  try { r = await fetch(url, options); }
  catch { throw new Error('Cannot reach the AstroVitals server'); }
  if (!r.ok) {
    let detail = '';
    try { const body = await r.json(); detail = body.detail || body.message || ''; }
    catch { /* response may have no JSON body */ }
    throw new Error(detail || `Request failed (${r.status})`);
  }
  return r;
}

export async function getCheckins() {
  if (BASE) return (await checkedFetch(`${BASE}/api/astronauts/${ID}/checkins`)).json();
  return load();
}
export async function addCheckin(c) {
  if (BASE) { await checkedFetch(`${BASE}/api/astronauts/${ID}/checkins`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) }); return; }
  const a = load().filter((x) => x.date !== c.date); a.push(c); a.sort((x, y) => x.date.localeCompare(y.date)); save(a);
}
export async function seedDemo() {
  if (demoMode) {
    save(seedMission());
    return;
  }

  if (BASE) {
    await checkedFetch(
      `${BASE}/api/demo/seed?scenario=combined-mission-demo`,
      { method: 'POST' }
    );
    return;
  }

  save(seedMission());
}

export async function resetAll() {
  if (demoMode) {
    save([]);
    return;
  }

  if (BASE) {
    await checkedFetch(
      `${BASE}/api/astronauts/${ID}/checkins`,
      { method: 'DELETE' }
    );
    return;
  }

  save([]);
}
// Backend mode: Spring Boot is the source of truth. Normalize the response for the shared UI.
export async function getStatus(envId) {
  const r = await checkedFetch(`${BASE}/api/astronauts/${ID}/status?env=${envId}`);
  const s = await r.json(), res = {};
  for (const [k, x] of Object.entries(s.indicators)) res[k] = { v: x.value, zone: x.zone, z: x.zScore, lvl: x.level };
  return { hasData: s.hasData, overall: s.overall, guidance: s.guidance, res, context: s.missionContext, alerts: s.alerts.map((a) => ({ k: a.indicator, label: a.label, lvl: a.level, why: a.reasons, hazard: a.hazard, escalation: a.escalation })) };
}
