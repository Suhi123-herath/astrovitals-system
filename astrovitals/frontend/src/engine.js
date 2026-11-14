// Status engine: absolute zones + personal baseline (z-score) + trend rule.
// Level 0 Normal, 1 Watch, 2 Report, 3 Urgent. Ranges are DEMO values, not medical advice.
export const iso = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const IND = {
  hr: { label: 'Heart rate', unit: 'bpm', g: [60, 100], y: [50, 110], hz: 'gravity' },
  sys: { label: 'Systolic BP', unit: 'mmHg', g: [90, 120], y: [85, 139], hz: 'gravity' },
  dia: { label: 'Diastolic BP', unit: 'mmHg', g: [60, 80], y: [55, 89], hz: 'gravity' },
  glucose: { label: 'Blood glucose', unit: 'mg/dL', g: [70, 99], y: [60, 125], hz: 'closed' },
  temp: { label: 'Temperature', unit: '°C', g: [36, 37.5], y: [35.5, 38], hz: 'closed' },
  sleep: { label: 'Sleep', unit: 'h', g: [7, 9.5], y: [5.5, 10.5], hz: 'isolation' },
  mood: { label: 'Mood', unit: '/5', g: [3, 5], y: [2, 5], hz: 'isolation' },
  exercise: { label: 'Exercise', unit: 'min', g: [30, 300], y: [15, 300], hz: 'gravity' },
  meals: { label: 'Meals', unit: '', g: [3, 6], y: [2, 6], hz: 'closed' },
};
export const KEYS = Object.keys(IND);
export const HAZ = { radiation: 'Space radiation', isolation: 'Isolation and confinement', distance: 'Distance from Earth', gravity: 'Altered gravity', closed: 'Hostile, closed environment' };
export const LEVELS = [{ n: 'No flag', icon: '✓' }, { n: 'Watch', icon: '●' }, { n: 'Report', icon: '▲' }, { n: 'Urgent', icon: '✖' }];

const EMERGENCY_SYMPTOMS = ['Chest pain', 'Fainting', 'Severe shortness of breath', 'Confusion', 'Thoughts of self-harm'];
export function withMissionContext(evaluation, rows, env) {
  const last = rows[rows.length - 1]; if (!last) return { ...evaluation, context: null };
  const alerts = [...evaluation.alerts];
  const symptoms = Array.isArray(last.symptoms) ? last.symptoms : (typeof last.symptoms === 'string' ? last.symptoms.split('|').filter(Boolean) : []);
  const emergency = symptoms.filter(s => EMERGENCY_SYMPTOMS.includes(s));
  if (last.environmentAlarm) alerts.push({ k: 'environment', label: 'Reported environmental alarm', lvl: 2, why: ['A crew member or connected source reported an environmental alarm. The app does not independently validate the sensor.'], hazard: HAZ.closed });
  if (emergency.length) alerts.push({ k: 'symptoms', label: 'Reported emergency symptoms', lvl: 3, why: [`Reported: ${emergency.join(', ')}`, 'This is a safety escalation prompt, not a diagnosis. Follow the onboard emergency medical protocol immediately.'], hazard: 'Crew health / medical support' });
  alerts.sort((a, b) => b.lvl - a.lvl);
  const notes = [];
  if (last.radiationDoseUsv != null) notes.push(`Radiation exposure recorded: ${last.radiationDoseUsv} µSv. Compare only with approved mission dosimetry limits.`);
  if (last.cabinCo2Ppm != null) notes.push(`Cabin CO₂ recorded: ${last.cabinCo2Ppm} ppm. No universal alert threshold is applied by this prototype.`);
  if (last.cabinTemperatureC != null) notes.push(`Cabin temperature recorded: ${last.cabinTemperatureC} °C. Use spacecraft environmental-control limits for interpretation.`);
  if (last.spo2 != null) notes.push(`SpO₂ recorded: ${last.spo2}%. This prototype does not apply an astronaut-specific clinical threshold.`);
  return { ...evaluation, alerts, overall: Math.max(0, ...alerts.map(a => a.lvl)), context: { environment: env?.id, phase: last.missionPhase, activityContext: last.activityContext, glucoseContext: last.glucoseContext, symptoms, radiationDoseUsv: last.radiationDoseUsv, cabinCo2Ppm: last.cabinCo2Ppm, cabinTemperatureC: last.cabinTemperatureC, environmentAlarm: Boolean(last.environmentAlarm), exposureSource: last.exposureSource, notes } };
}

export const zoneOf = (k, v) => { const { g, y } = IND[k]; return v >= g[0] && v <= g[1] ? 0 : v >= y[0] && v <= y[1] ? 1 : 2; };
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;

export function baseline(rows, k) {
  const v = rows.slice(0, 7).map((r) => r[k]).filter((x) => x != null);
  if (v.length < 5) return null; // need at least 5 days to learn a "normal"
  const m = mean(v);
  const sd = Math.max(Math.sqrt(mean(v.map((x) => (x - m) ** 2))), Math.abs(m) * 0.02, 0.1); // floor avoids divide-by-zero
  return { m, sd };
}

export function evaluate(rows) {
  const res = {}, alerts = [], last = rows[rows.length - 1];
  if (!last) return { res, alerts, overall: 0 };
  for (const k of KEYS) {
    const v = last[k]; if (v == null) continue;
    const zone = zoneOf(k, v), b = rows.length > 7 ? baseline(rows, k) : null, z = b ? (v - b.m) / b.sd : null, why = [];
    let lvl = zone;
    if (zone) why.push(`Zone: ${v}${IND[k].unit} is outside the configured demonstration band ${IND[k].g[0]} to ${IND[k].g[1]}.`);
    if (z != null && Math.abs(z) >= 2) {
      lvl = Math.max(lvl, Math.abs(z) >= 3 ? 2 : 1);
      why.push(`Baseline: ${Math.abs(z).toFixed(1)} standard deviations from your first-week average (${b.m.toFixed(1)}).`);
    }
    if (zone === 2 && z != null && Math.abs(z) >= 3) lvl = 3;
    const t = rows.slice(-3).map((r) => r[k]);
    const consecutive = t.length === 3 && (new Date(`${rows[rows.length - 3].date}T00:00:00Z`).getTime() + 86400000 === new Date(`${rows[rows.length - 2].date}T00:00:00Z`).getTime()) && (new Date(`${rows[rows.length - 2].date}T00:00:00Z`).getTime() + 86400000 === new Date(`${rows[rows.length - 1].date}T00:00:00Z`).getTime());
    if ((k === 'sleep' || k === 'mood') && consecutive && t[0] > t[1] && t[1] > t[2]) { lvl = Math.max(lvl, 1); why.push(`Trend: ${IND[k].label.toLowerCase()} fell 3 days in a row.`); }
    res[k] = { v, zone, z, lvl };
    if (lvl > 0) alerts.push({ k, lvl, why, hazard: HAZ[IND[k].hz] });
  }
  alerts.sort((a, b) => b.lvl - a.lvl);
  return { res, alerts, overall: Math.max(0, ...alerts.map((a) => a.lvl)) };
}

export const escalate = (lvl, env) => [
  'No configured assessment rules were triggered. This does not guarantee medical wellness; continue scheduled monitoring.',
  'Self-manage: follow the suggested actions and check again tomorrow.',
  env.delay ? 'Report to the flight surgeon. The reply may take minutes, so follow the onboard protocol and ask a crewmate to help while you wait.' : 'Report to the flight surgeon at the next communication window.',
  env.delay ? 'Urgent: alert the crew now and start the onboard emergency protocol. Contact ground in parallel.' : 'Urgent: alert the crew and contact ground now.',
][lvl];

export function game(rows) {
  const dates = new Set(rows.map((r) => r.date)), d = new Date(); let streak = 0;
  if (!dates.has(iso(d))) d.setDate(d.getDate() - 1);
  while (dates.has(iso(d))) { streak++; d.setDate(d.getDate() - 1); }
  const badges = [];
  if (streak >= 3) badges.push('3-day streak'); if (streak >= 7) badges.push('7-day streak');
  if (rows.filter((r) => r.exercise >= 30).length >= 5) badges.push('Exercise champion');
  if (rows.length >= 30) badges.push('Full mission logged');
  return { streak, badges }; // rewards logging and countermeasures, never "good readings"
}

export function dueTasks(rows) {
  const t = rows.find((r) => r.date === iso()), out = [];
  if (!t) return ['Log today’s check-in'];
  if ((t.exercise ?? 0) < 30) out.push('Complete a 30-minute exercise session');
  if ((t.meals ?? 0) < 3) out.push('Eat your remaining scheduled meals');
  return out;
}

const rng = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
// 30-day synthetic mission trend scenario. It is simulated data and does not claim radiation caused the changes.
export function seedMission() {
  const r = rng(42), n = 30, j = (a) => (r() - 0.5) * 2 * a;
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (n - 1 - i));
    const s = Math.max(0, i - 11) / 18;
    return { date: iso(d), missionEnvironment: 'station', missionPhase: 'in_mission', activityContext: 'resting', glucoseContext: 'unknown', exposureSource: 'SIMULATED', spo2: 98, hydrationMl: 2200, radiationDoseUsv: +(0.7 + r() * 0.4).toFixed(2), cabinCo2Ppm: Math.round(600 + j(35)), cabinTemperatureC: +(22 + j(0.5)).toFixed(1), environmentAlarm: false, symptoms: '', hr: Math.round(66 + j(3) + s * 14), sys: Math.round(113 + j(3) + s * 8), dia: Math.round(74 + j(2) + s * 5),
      glucose: Math.round(88 + j(4) + s * 10), temp: +(36.6 + j(0.2) + s * 0.5).toFixed(1), sleep: +(7.6 + j(0.4) - s * 2.6).toFixed(1),
      mood: Math.max(1, Math.min(5, Math.round(4 + j(0.6) - s * 2))), stress: Math.max(1, Math.min(5, Math.round(2 + j(0.5) + s * 2))), exercise: Math.round(45 + j(10) - s * 25), meals: 3 };
  });
}
