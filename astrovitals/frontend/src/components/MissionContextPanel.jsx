
import { ENVS } from '../content.js';

const value = (v, unit) =>
  v == null || v === '' ? 'Not recorded' : `${v} ${unit}`;

const missionVisuals = {
  station: { emoji: '🚀', label: 'Space station' },
  transit: { emoji: '🛸', label: 'Transit' },
  moon: { emoji: '🌙', label: 'Moon' },
  mars: { emoji: null, label: 'Mars' }
};

export default function MissionContextPanel({ env, rows = [], context }) {
  const last = rows[rows.length - 1];
  const c = context || last || {};
  const selected = ENVS.find(x => x.id === env.id) || env;
  const visual = missionVisuals[env.id] || missionVisuals.station;

  return (
    <section className="box mission-context-panel">

      <div className="mission-header">
        <div className="mission-title-group">
          <p className="eyebrow">MISSION ENVIRONMENT</p>
          <h2>{selected.name}</h2>
        </div>

        <div
          className={`mission-visual ${env.id}`}
          role="img"
          aria-label={visual.label}
        >
          {env.id === 'mars' ? (
            <span className="mars-planet">
              <i className="mars-crater crater-one" />
              <i className="mars-crater crater-two" />
              <i className="mars-crater crater-three" />
            </span>
          ) : (
            <span className="mission-emoji">{visual.emoji}</span>
          )}
        </div>

        <span className={`badge mission-status ${selected.delay ? 'badge-warn' : ''}`}>
          {selected.commsLabel || (selected.delay ? 'Delayed ground communications' : 'Near-real-time ground contact')}
        </span>
      </div>

      <p className="muted">{selected.note}</p>

      <div className="exposure-grid">
        <div>
          <small>Radiation dose recorded</small>
          <strong>{value(c.radiationDoseUsv, 'µSv')}</strong>
        </div>
        <div>
          <small>Cabin CO₂</small>
          <strong>{value(c.cabinCo2Ppm, 'ppm')}</strong>
        </div>
        <div>
          <small>Cabin temperature</small>
          <strong>{value(c.cabinTemperatureC, '°C')}</strong>
        </div>
        <div>
          <small>SpO₂</small>
          <strong>{value(last?.spo2, '%')}</strong>
        </div>
        <div>
          <small>Self-reported stress</small>
          <strong>{value(last?.stress, '/5')}</strong>
        </div>
      </div>

      {selected.focus?.length > 0 && (
        <div className="mission-focus">
          <small>Mission-relevant hazard domains</small>
          <div>
            {selected.focus.map(x => <span key={x}>{x}</span>)}
          </div>
        </div>
      )}

      <div className="mission-context-foot">
        <span>Phase: <b>{c.phase || c.missionPhase || 'Not recorded'}</b></span>
        <span>Activity: <b>{c.activityContext || 'Not recorded'}</b></span>
        <span>Source: <b>{c.exposureSource || 'Not recorded'}</b></span>
      </div>

      {c.environmentAlarm && (
        <p className="context-warning">
          Environmental alarm reported — follow onboard environmental-control procedures.
        </p>
      )}

      {c.notes?.length > 0 && (
        <ul className="context-notes">
          {c.notes.map(n => <li key={n}>{n}</li>)}
        </ul>
      )}

      <p className="micro-note">
        Exposure values are observations, not vital signs. No unapproved
        radiation, CO₂, or cabin-temperature thresholds are applied.
        Use mission-approved sensor limits and procedures.
      </p>

    </section>
  );
}
