import { IND, HAZ, LEVELS, escalate } from '../engine.js';
import { REGIONS, RESEARCH } from '../content.js';

const EVIDENCE = {
  'Altered gravity': ['nasa-hazards', 'nasa-risks', 'nasa-research'],
  'Isolation and confinement': ['nasa-hazards', 'nasa-risks', 'nasa-research'],
  'Hostile, closed environment': ['nasa-hazards', 'nasa-risks', 'nasa-research'],
  'Hostile/closed environment': ['nasa-hazards', 'nasa-risks', 'nasa-research'],
  'Space radiation': ['nasa-hazards', 'nasa-risks', 'csa-radiation'],
  'Distance from Earth': ['nasa-hazards', 'nasa-risks'],
  'Crew health / medical support': ['nasa-risks', 'nasa-research'],
};

export default function Alerts({ alerts = [], env, hasData }) {
  return <section className="box" id="alerts" aria-label="Health alerts">
    <p className="eyebrow">DECISION SUPPORT</p>
    <h2>Health flags and recommended actions</h2>
    <p className="muted">These flags are not diagnoses. Follow approved onboard medical and environmental procedures, especially for new, severe or worsening symptoms.</p>
    {!alerts.length && <p>{hasData ? 'No configured flags were triggered by the available data. This does not guarantee that the astronaut is medically healthy.' : 'No health assessment is available yet. Record a check-in to begin.'}</p>}
    {alerts.map((alert, index) => {
      const region = REGIONS.find((item) => item.inds.includes(alert.k));
      const label = alert.label || IND[alert.k]?.label || alert.k;
      const hazard = alert.hazard || (IND[alert.k] ? HAZ[IND[alert.k].hz] : null);
      const sourceIds = [...(EVIDENCE[hazard] || ['nasa-risks'])];
      // OSD-575 is relevant as a small metabolic/immune biomarker research cohort, not as a clinical threshold.
      if (alert.k === 'glucose') sourceIds.push('osd-575');
      const sources = [...new Set(sourceIds)].map((id) => RESEARCH.find((source) => source.id === id)).filter(Boolean);
      const why = region?.tabs?.why;
      const hazardContext = region?.tabs?.hazards;
      const action = region?.tabs?.act;

      return <article key={`${alert.k}-${index}`} className={`alert lv${alert.lvl}`}>
        <h3>{LEVELS[alert.lvl]?.icon || '•'} {label}: {LEVELS[alert.lvl]?.n || 'Review'}</h3>
        {alert.why?.length > 0 && <><p><b>What changed?</b></p><ul>{alert.why.map((reason) => <li key={reason}>{reason}</li>)}</ul></>}
        {hazard && <p className="muted"><b>Relevant spaceflight hazard:</b> {hazard}</p>}
        {why && <p><b>Why it matters:</b> {why}</p>}
        {hazardContext && <p><b>Spaceflight context:</b> {hazardContext}</p>}
        {action && <p><b>Recommended action:</b> {action}</p>}
        {alert.k === 'environment' && <p><b>Recommended action:</b> Verify the onboard sensor/alarm, notify the responsible crew member, and follow spacecraft environmental-control procedures.</p>}
        {alert.k === 'symptoms' && <p><b>Recommended action:</b> Alert the crew and follow the onboard emergency medical protocol now.</p>}
        {sources.length > 0 && <div className="alert-evidence"><b>Relevant research:</b><ul>{sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.agency}: {source.title}</a></li>)}</ul></div>}
        {alert.k === 'glucose' && <p className="micro-note">OSD-575 contains serum metabolic and immune/cardiac biomarker research from four Inspiration4 crew members. It is not a live glucose feed or a personal clinical reference range.</p>}
        <p className="alert-escalation"><b>When to contact the flight surgeon / ground:</b> {alert.escalation ?? escalate(alert.lvl, env)}</p>
      </article>;
    })}
  </section>;
}


