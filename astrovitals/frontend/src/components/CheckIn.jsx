import { useEffect, useState } from 'react';
import { iso } from '../engine.js';

const F = [
  ['hr', 'Heart rate (bpm)', 40, 200, 1], ['sys', 'Systolic BP (mmHg)', 60, 220, 1], ['dia', 'Diastolic BP (mmHg)', 40, 140, 1],
  ['glucose', 'Blood glucose (mg/dL)', 30, 500, 1], ['temp', 'Body temperature (°C)', 33, 42, 0.1], ['sleep', 'Sleep last night (h)', 0, 16, 0.1],
  ['exercise', 'Exercise today (min)', 0, 300, 5], ['meals', 'Meals eaten', 0, 8, 1],
];
const OPTIONAL = [
  ['spo2', 'SpO₂ (%)', 50, 100, 1], ['hydrationMl', 'Water intake (mL)', 0, 10000, 100],
  ['radiationDoseUsv', 'Radiation dose recorded (µSv)', 0, 100000, 0.1], ['cabinCo2Ppm', 'Cabin CO₂ (ppm)', 0, 100000, 10],
  ['cabinTemperatureC', 'Cabin temperature (°C)', -50, 100, 0.1],
];
const MOODS = ['Very low', 'Low', 'Okay', 'Good', 'Great'];
const SYMPTOMS = ['Headache', 'Dizziness', 'Nausea', 'Fatigue', 'Vision changes', 'Shortness of breath', 'Chest pain', 'Fainting', 'Severe shortness of breath', 'Confusion', 'Fever or chills', 'Rash', 'Sore throat or cough', 'Muscle or joint pain', 'Thoughts of self-harm'];
const EMPTY = { hr: '', sys: '', dia: '', glucose: '', temp: '', sleep: '', exercise: '', meals: '', mood: 0, stress: '',
  spo2: '', hydrationMl: '', radiationDoseUsv: '', cabinCo2Ppm: '', cabinTemperatureC: '', activityContext: 'resting',
  glucoseContext: 'unknown', missionPhase: 'in_mission', symptoms: [], environmentAlarm: false, exposureSource: 'manual' };
const currentForm = (rows) => { const last = rows[rows.length - 1]; return last?.date === iso() ? { ...EMPTY, ...last, symptoms: typeof last.symptoms === 'string' ? last.symptoms.split('|').filter(Boolean) : (last.symptoms || []) } : { ...EMPTY }; };

function NumericFields({ fields, values, onChange, previous }) {
  return <div className="fields">{fields.map(([k, label, lo, hi, step]) => (
    <label key={k}>{label}<input type="number" min={lo} max={hi} step={step} value={values[k] ?? ''}
      placeholder={previous?.[k] != null ? `Previous: ${previous[k]}` : 'Optional'}
      onChange={(e) => onChange(k, e.target.value)} /></label>
  ))}</div>;
}

export default function CheckIn({ rows, onSave, environment = 'station' }) {
  const [v, setV] = useState(() => currentForm(rows));
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { setV(currentForm(rows)); }, [rows]);
  const set = (k, value) => { setV(old => ({ ...old, [k]: value })); setMsg(''); };

  const submit = async (e) => {
    e.preventDefault(); setMsg('');
    const bad = F.find(([k, label, lo, hi]) => v[k] === '' || !Number.isFinite(Number(v[k])) || Number(v[k]) < lo || Number(v[k]) > hi);
    if (bad) return setMsg(`${bad[1]} must be between ${bad[2]} and ${bad[3]}.`);
    if (!Number.isInteger(Number(v.mood)) || Number(v.mood) < 1 || Number(v.mood) > 5) return setMsg('Please select your mood from 1 to 5.');
    if (Number(v.sys) <= Number(v.dia)) return setMsg('Systolic pressure should be greater than diastolic pressure. Please verify both values.');
    for (const [k, label, lo, hi] of OPTIONAL) if (v[k] !== '' && (!Number.isFinite(Number(v[k])) || Number(v[k]) < lo || Number(v[k]) > hi)) return setMsg(`${label} must be between ${lo} and ${hi}.`);
    setSaving(true);
    try {
      const payload = { date: iso(), ...Object.fromEntries([...F.map(([k]) => k), 'mood'].map((k) => [k, Number(v[k])])), stress: v.stress === '' ? null : Number(v.stress),
        ...Object.fromEntries(OPTIONAL.map(([k]) => [k, v[k] === '' ? null : Number(v[k])])),
        missionEnvironment: environment, missionPhase: v.missionPhase, activityContext: v.activityContext, glucoseContext: v.glucoseContext,
        symptoms: v.symptoms.join('|'), environmentAlarm: Boolean(v.environmentAlarm), exposureSource: v.exposureSource.toUpperCase() };
      const ok = await onSave(payload);
      setMsg(ok === false ? 'We could not save this check-in. Please check the connection and try again.' : 'Check-in saved. Your health overview has been refreshed.');
    } finally { setSaving(false); }
  };

  return (
    <form className="box checkin-form" id="checkin" onSubmit={submit}>
      <div className="row between"><h2>Mission health check-in</h2><span className="badge">{iso()}</span></div>
      <p className="muted">Enter measurements from approved onboard devices. Optional fields can be left blank. Never estimate a sensor reading.</p>
      <div className="context-grid">
        <label>Mission phase<select value={v.missionPhase} onChange={e => set('missionPhase', e.target.value)}><option value="preflight">Pre-flight</option><option value="launch">Launch / ascent</option><option value="in_mission">In mission</option><option value="landing">Landing / re-entry</option><option value="postflight">Post-flight</option></select></label>
        <label>Activity at measurement<select value={v.activityContext} onChange={e => set('activityContext', e.target.value)}><option value="resting">Resting</option><option value="exercise">During exercise</option><option value="recovery">Recovery</option><option value="unknown">Unknown</option></select></label>
        <label>Glucose timing<select value={v.glucoseContext} onChange={e => set('glucoseContext', e.target.value)}><option value="unknown">Not recorded</option><option value="fasting">Fasting / before meal</option><option value="post_meal">After meal</option></select></label>
      </div>
      <h3>Physiological measurements</h3>
      <NumericFields fields={F} values={v} previous={rows[rows.length - 1]} onChange={set} />
      <fieldset><legend>Psychological wellbeing</legend>
        <p className="muted">How would you describe your mood today?</p>
        <div className="moods">{MOODS.map((m, i) => <button type="button" key={m} aria-pressed={Number(v.mood) === i + 1} className={Number(v.mood) === i + 1 ? 'on' : ''} onClick={() => set('mood', i + 1)}>{i + 1}<small>{m}</small></button>)}</div>
        <label className="stress-field">Stress level (1 low – 5 high)
          <select value={v.stress} onChange={e => set('stress', e.target.value)}><option value="">Not recorded</option>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select>
        </label>
      </fieldset>
      <fieldset><legend>Symptoms (select any that apply)</legend>
        <div className="symptom-grid">{SYMPTOMS.map(s => <label key={s} className="check-option"><input type="checkbox" checked={v.symptoms.includes(s)} onChange={e => set('symptoms', e.target.checked ? [...v.symptoms, s] : v.symptoms.filter(x => x !== s))}/>{s}</label>)}</div>
      </fieldset>
      <details className="exposure-details">
        <summary>Environmental exposure & additional sensors <span>Optional</span></summary>
        <p className="muted">Record only values provided by a calibrated mission sensor or approved record. AstroVitals does not invent environmental limits.</p>
        <NumericFields fields={OPTIONAL} values={v} onChange={set} previous={rows[rows.length - 1]} />
        <label className="check-option alarm-check"><input type="checkbox" checked={Boolean(v.environmentAlarm)} onChange={e => set('environmentAlarm', e.target.checked)}/> An onboard environmental alarm has been reported</label>
        <label>Data source<select value={v.exposureSource} onChange={e => set('exposureSource', e.target.value)}><option value="manual">Manually entered</option><option value="sensor">Connected / onboard sensor</option><option value="simulated">Simulated demonstration data</option></select></label>
      </details>
      <button type="submit" disabled={saving}>{saving ? 'Saving check-in…' : 'Save mission health check-in'}</button>
      {msg && <p className="muted" role="status" aria-live="polite">{msg}</p>}
    </form>
  );
}
