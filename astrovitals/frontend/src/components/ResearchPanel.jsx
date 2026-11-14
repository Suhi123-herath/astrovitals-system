import { RESEARCH } from '../content.js';

export default function ResearchPanel() {
  return <section className="box research-panel" id="research" aria-label="NASA research evidence">
    <div className="row between"><div><p className="eyebrow">EVIDENCE LIBRARY</p><h2>NASA & space-agency research</h2></div><span className="badge">6 curated sources</span></div>
    <p className="muted">Research explains why a monitoring domain matters. It does not, by itself, define personal clinical thresholds or diagnose an astronaut.</p>
    <div className="research-grid">{RESEARCH.map(source => <article className="research-card" key={source.id}>
      <div className="research-meta"><span>{source.agency}</span><span>{source.domain}</span></div>
      <h3>{source.title}</h3><p>{source.summary}</p>
      <div className="research-tags">{source.supports.map(tag => <span key={tag}>{tag}</span>)}</div>
      <a href={source.url} target="_blank" rel="noreferrer">Open source ↗</a>
    </article>)}</div>
    <div className="osd-note">
      <div><p className="eyebrow">OPTIONAL DATASET CONTEXT</p><h3>OSD-575 · Inspiration4</h3></div>
      <p>OSD-575 contains pre- and post-flight serum metabolic and immune/cardiac biomarker measurements from four crew members. It can inform research questions and variable selection, but its small cohort and repeated samples do not support a general astronaut risk classifier or personal clinical thresholds. AstroVitals does not present it as live wearable data.</p>
      <a href="https://osdr.nasa.gov/bio/repo/data/studies/OSD-575" target="_blank" rel="noreferrer">Explore the NASA OSDR study ↗</a>
    </div>
    <div className="evidence-guardrail"><strong>Evidence rule:</strong> AstroVitals separates (1) an astronaut's own readings, (2) environmental sensor observations, and (3) external research-cohort findings. These data types are never plotted as if they were interchangeable.</div>
  </section>;
}
