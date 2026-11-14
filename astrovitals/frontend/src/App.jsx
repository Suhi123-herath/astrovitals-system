import { useEffect, useMemo, useState } from 'react';
import { getCheckins, addCheckin, seedDemo, resetAll, getStatus, REMOTE } from './api.js';
import { evaluate, withMissionContext, game, escalate, LEVELS, iso } from './engine.js';
import { ENVS } from './content.js';
import CheckIn from './components/CheckIn.jsx';
import Body from './components/Body.jsx';
import Alerts from './components/Alerts.jsx';
import ProfilePhoto from './components/ProfilePhoto.jsx';
import Charts from './components/Charts.jsx';
import MissionContextPanel from './components/MissionContextPanel.jsx';
import ResearchPanel from './components/ResearchPanel.jsx';
import MissionEngagement from './components/MissionEngagement.jsx';
import Journal from './components/Journal.jsx';

export default function App({ onLogout, profile }) {
  const [rows, setRows] = useState([]), [env, setEnv] = useState(ENVS[0]), [err, setErr] = useState('');
  const [journalProgress, setJournalProgress] = useState({ today: false, streak: 0 });
  const refresh = async () => { try { setRows(await getCheckins()); setErr(''); } catch (e) { setErr(e.message + '. Check that the server is running.'); } };
  useEffect(() => { refresh(); }, []);
  const run = (fn) => async (...a) => { try { await fn(...a); await refresh(); return true; } catch (e) { setErr(e.message); return false; } };
  const [remote, setRemote] = useState({ hasData: false, res: {}, alerts: [], overall: 0 });
  useEffect(() => { if (REMOTE) getStatus(env.id).then(setRemote).catch((e) => setErr(e.message)); }, [rows, env]);
  const ev = useMemo(() => REMOTE ? remote : withMissionContext(evaluate(rows), rows, env), [rows, remote, env]);
  const g = useMemo(() => game(rows), [rows]);
  const todayRow = rows.find((row) => row.date === iso());
  const outstandingTasks = (todayRow ? 0 : 1) + (Number(todayRow?.exercise || 0) < 30 ? 1 : 0) + (Number(todayRow?.meals || 0) < 3 ? 1 : 0) + (journalProgress.today ? 0 : 1);
  const L = LEVELS[ev.overall] || LEVELS[0];
  const hasData = REMOTE ? Boolean(ev.hasData) : rows.length > 0;
  const latest = rows[rows.length - 1];
  const latestVitals = [
    ['Heart rate', latest?.hr, 'bpm'],
    ['Blood pressure', latest?.sys != null && latest?.dia != null ? `${latest.sys}/${latest.dia}` : null, 'mmHg'],
    ['Sleep', latest?.sleep, 'h'],
    ['SpO₂', latest?.spo2, '%'],
  ];

  return <>
    <header className="top">
      <div className="user-profile"><ProfilePhoto name={profile?.name || 'Astronaut'} size={55} /><span>{profile?.name || 'Astronaut'}</span></div>
      <div className="brand"><div className="brand-mark" aria-hidden="true">✦</div><div><div className="eyebrow">CREW HEALTH • MISSION SUPPORT</div><h1>AstroVitals</h1><p>Evidence-aware health monitoring beyond Earth.</p><p className="signed-in-as">Demo crew profile: {profile?.name || profile?.email || 'Crew member'}</p>{profile?.demo && (
                                                                                                                                                                                                                                                                                                                                    <span className="demo-mode-pill">
                                                                                                                                                                                                                                                                                                                                      ✦ JUDGE DEMO · SYNTHETIC DATA
                                                                                                                                                                                                                                                                                                                                    </span>
                                                                                                                                                                                                                                                                                                                                  )}</div></div>
      <label className="env">Mission environment<select value={env.id} onChange={(e) => setEnv(ENVS.find((x) => x.id === e.target.value))}>{ENVS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select><span>{env.note}</span></label>
      <button className="logout-button" onClick={onLogout}>Sign out ↗</button>
    </header>
    <nav className="section-nav" aria-label="Dashboard sections">
      <a href="#overview">Overview</a><a href="#body-map">3D health map</a><a href="#checkin">Daily check-in</a><a href="#tasks">Tasks & badges</a><a href="#journal">Crew journal</a><a href="#alerts">Alerts</a><a href="#trends">Trends</a><a href="#research">Research</a>
    </nav>
    <main>
      <section id="overview" className="metric-strip" aria-label="Mission overview">
        <div className="metric"><span className="metric-icon" aria-hidden="true">◉</span><small>Recorded check-ins</small><strong>{rows.length}</strong></div>
        <div className="metric"><span className="metric-icon" aria-hidden="true">⚑</span><small>Active health flags</small><strong>{ev.alerts.length}</strong></div>
        <div className="metric"><span className="metric-icon" aria-hidden="true">✧</span><small>Check-in streak</small><strong>{g.streak} day{g.streak === 1 ? '' : 's'}</strong></div>
        <div className="metric"><span className="metric-icon" aria-hidden="true">⌖</span><small>Mission environment</small><strong>{env.name}</strong></div>
        <div className="metric"><span className="metric-icon" aria-hidden="true">☑</span><small>Outstanding tasks</small><strong>{outstandingTasks}</strong></div>
      </section>
      <section className="latest-readings" aria-label="Latest vital signs">
        <div className="section-kicker">LATEST RECORDED MEASUREMENTS <span>{latest?.date || 'No check-in recorded'}</span></div>
        <div className="latest-grid">{latestVitals.map(([label, value, unit]) => <article className="latest-card" key={label}><small>{label}</small><strong>{value == null ? '—' : `${value} ${unit}`}</strong><span>{value == null ? 'No data' : 'Latest entry'}</span></article>)}</div>
      </section>
      {err && <p className="err" role="alert">{err}</p>}
      <section className={`banner lv${hasData ? ev.overall : 'x'}`} aria-live="polite">
        <strong>{hasData ? `${L.icon} Overall assessment: ${L.n}` : 'No health data yet'}</strong>
        <span>{hasData ? (ev.guidance || escalate(ev.overall, env)) : 'Record your first mission check-in to begin.'}</span>
      </section>
      <div className="hero">
        <Body ev={ev} rows={rows} />
        <div className="side">
          <CheckIn rows={rows} environment={env.id} onSave={run(addCheckin)} />
                   <div className="box demo-controls">
            <div className="row"><button onClick={run(seedDemo)}>Load synthetic mission demo</button><button className="ghost" onClick={run(resetAll)}>Clear health data</button></div>
            <p className="micro-note">Demo records are synthetic and are not actual astronaut or sensor data. Clearing health data does not delete locally stored journal entries.</p>
          </div>
        </div>
      </div>


        <MissionEngagement
          rows={rows}
          gameState={g}
          journalProgress={journalProgress}
        />

        <div id="mission-context">
          <MissionContextPanel env={env} rows={rows} context={ev.context} />
        </div>
      <Journal onProgress={setJournalProgress} />
      <Alerts alerts={ev.alerts} env={env} hasData={hasData} />
      <Charts rows={rows} />
      <ResearchPanel />
      <footer>AstroVitals • NASA Space Apps 2026 prototype. Research sources provide scientific context; this prototype does not diagnose or replace flight-surgeon guidance. Numeric demonstration bands are illustrative, not NASA-approved medical thresholds.</footer>
    </main>
  </>;
}
