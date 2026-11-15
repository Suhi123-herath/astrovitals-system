# Astrovitals-system
## 🚀 Live Demo

**AstroVitals – Live Frontend:**  
[[Open AstroVitals](https://your-frontend-link.com](https://suhi123-herath.github.io/astrovitals-system/))


Mission-aware astronaut health monitoring prototype for the NASA Space Apps 2026 challenge. AstroVitals combines personal physiological check-ins, psychological wellbeing, reported symptoms, environmental observations, mission context, and traceable space-agency research to identify concerning changes and suggest appropriate next steps.

> **Prototype / hackathon notice:** This is not a medical device, diagnostic system, flight-certified tool, or replacement for mission medical procedures. Numeric bands in the demonstration engine are illustrative and are not NASA-approved astronaut thresholds. The demo sign-in is browser-only and is not production authentication.

## Architecture

```text
React (Webpack + Babel) -> Spring Boot 3 / Java 17 REST API -> MySQL or H2
  health check-in             DTO validation + services + repositories
  body map + charts           explainable assessment engine
  mission context             communication-aware escalation
  NASA / CSA evidence panel   curated research references
```

## What is included

- Daily physiological measurements: heart rate, blood pressure, glucose, temperature, sleep, mood, self-reported stress, exercise and meals.
- Optional context: SpO2, hydration, activity at measurement, glucose timing, symptoms and mission phase.
- Environmental observations: radiation dose, cabin CO2, cabin temperature, onboard environmental alarm, and data provenance.
- Personal baseline and trend flags, with reasons shown for each assessment.
- Single-page sticky section navigation for overview, 3D body map, check-in, tasks, crew journal, alerts, trends and research.
- Dashboard snapshot with latest available vital signs, mission environment, outstanding tasks and active flags.
- Auto-rotating, clickable 3D body map with dedicated eyes and lungs, plus brain/balance, heart, metabolic, skin, bone/muscle and nutrition guidance across five educational tabs.
- Interactive mission engagement: daily task progress rings, unlocked / locked achievement cards, check-in and exercise milestones.
- Crew reflection journal with daily prompts, a reflection streak and an optional in-app reminder. Journal entries and reminder settings stay in browser localStorage and are not sent to the backend; the reminder appears only while the dashboard is open.
- Weekly, monthly and 3-month chart filters, personal baseline reference lines and explicit missing-data states.
- Hazard-specific alert explanations and relevant NASA/CSA citations rather than a generic source list on every alert.
- ISS / transit / Moon / Mars mission context and delayed-communication escalation wording.
- Curated NASA HRP, Canadian Space Agency and NASA OSDR references.
- Explicit separation of astronaut readings, environmental observations and research-cohort data.
- Synthetic 30-day scenario for demonstrating trend detection. It is not real astronaut or sensor data.

## Run it

**Backend (H2, no database setup):**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Set `API_URL=http://localhost:8080` in `frontend/.env.local` to connect to Spring Boot. If `API_URL` is empty, the frontend uses browser localStorage demo mode.

**Docker:**
```bash
docker compose up --build
```

## API

- `POST /api/astronauts/{id}/checkins` — save or replace a daily check-in.
- `GET /api/astronauts/{id}/checkins` — retrieve check-in history.
- `DELETE /api/astronauts/{id}/checkins` — clear demo history.
- `GET /api/astronauts/{id}/status?env=station|transit|moon|mars` — assessment, reasons, mission context and alerts.
- `GET /api/astronauts/{id}/alerts?env=` — alert list.
- `GET /api/astronauts/{id}/tasks` — demo tasks and streak.
- `GET /api/content` — body-region education.
- `POST /api/demo/seed?scenario=combined-mission-demo` — load synthetic demonstration records.

## Scientific approach and evidence boundaries

AstroVitals uses NASA's five human-spaceflight hazards as a mission-context framework: space radiation, isolation and confinement, distance from Earth, altered gravity, and hostile/closed environments. These hazards can interact, so the system shows context alongside personal trends. It does not claim that a particular hazard caused an individual's measurement change.

The research panel links to the five supplied resources: NASA HRP Hazards, Risks and Ongoing Research, plus the Canadian Space Agency radiation-monitoring and space-science explainers. Body-region guidance is written to distinguish self-reported symptoms, optional measurements and clinical assessment; it does not create new NASA-approved thresholds. It also links to NASA OSDR OSD-575, an Inspiration4 biospecimen study. OSD-575 is not a live wearable feed and must not be used as a personal clinical reference range.

Evidence links:
- [NASA HRP — Five Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards/)
- [NASA HRP — Risks of Human Spaceflight](https://www.nasa.gov/hrp/risks/)
- [NASA HRP — Ongoing Research](https://www.nasa.gov/hrp/ongoing-hrp-research/)
- [Canadian Space Agency — Monitoring Radiation for Astronaut Health](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp)
- [Canadian Space Agency — Why conduct science experiments in space?](https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp)
- [NASA OSDR — OSD-575 Inspiration4 serum study](https://osdr.nasa.gov/bio/repo/data/studies/OSD-575)

**Environmental data guardrail:** radiation dose, cabin CO2 and cabin temperature are stored as observations. This prototype does not invent universal exposure limits. Any operational alert must be based on the mission's approved instrument limits and procedures. A manually reported environmental alarm is surfaced as a report-level signal but is not independently sensor-verified.

**Symptoms guardrail:** selected emergency symptoms trigger an urgent prompt to follow onboard emergency medical procedures. This is a safety escalation prompt, not a diagnosis.

**Research-data guardrail:** NASA research-cohort measurements are presented as evidence context only. They are not merged into an astronaut's personal trend chart.


## API payload

The backend accepts the original required daily measurements plus optional context fields: `stress`, `spo2`, `hydrationMl`, `missionEnvironment`, `missionPhase`, `activityContext`, `glucoseContext`, `symptoms`, `radiationDoseUsv`, `cabinCo2Ppm`, `cabinTemperatureC`, `environmentAlarm` and `exposureSource`.
