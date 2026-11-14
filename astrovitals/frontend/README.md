# AstroVitals frontend

React + Webpack frontend for the NASA Space Apps 2026 challenge **Create Health Monitoring Software for Astronauts on Space Missions**.

## Run it

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set `API_URL=http://localhost:8080` to use Spring Boot. Leave it empty for browser-localStorage demo mode.

## Main features

- Daily physiological check-in: heart rate, blood pressure, glucose, temperature, sleep, mood, stress, exercise and meals.
- Mission context: mission environment, mission phase, activity context and glucose timing.
- Symptoms and optional observations: SpO2, hydration, radiation dose, cabin CO2, cabin temperature and reported environmental alarms.
- Personal baseline and trend-based flags with visible reasons.
- Mission-aware escalation wording for near-Earth and delayed-communication environments.
- Interactive 3D body map, personal health charts, mission exposure summary and curated NASA/CSA evidence panel.
- Explicit labels for synthetic demo records and evidence limitations.

## Evidence panel sources

NASA HRP Hazards, Risks and Ongoing Research; Canadian Space Agency radiation monitoring and space-science explainers; and NASA OSDR OSD-575. OSD-575 is a biospecimen study, not a real-time vital-sign feed.

## Important boundaries

The application is a hackathon prototype, not a diagnostic or flight-certified medical system. Numeric bands in the assessment engine are illustrative, not NASA-approved thresholds. Radiation, cabin CO2 and cabin temperature are displayed as recorded observations; no unapproved universal exposure thresholds are applied. The sign-in screen is browser-only demo access, not production authentication.

## API payload

The backend accepts the original required daily measurements plus optional context fields: `stress`, `spo2`, `hydrationMl`, `missionEnvironment`, `missionPhase`, `activityContext`, `glucoseContext`, `symptoms`, `radiationDoseUsv`, `cabinCo2Ppm`, `cabinTemperatureC`, `environmentAlarm` and `exposureSource`.
