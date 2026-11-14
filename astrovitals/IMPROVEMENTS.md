# AstroVitals — improvement pass

## Changes in this pass

- Reworked gamification into interactive daily task cards with circular progress rings and visible locked / unlocked achievement cards. Progress is awarded for participation and countermeasure logging, never for a particular health reading.
- Added a crew reflection journal with rotating daily prompts, a reflection streak and an optional daily in-app reminder. Journal text and reminder preferences are stored in the browser only; they are not sent to Spring Boot. The reminder appears while the dashboard is open.
- Expanded the rotating, clickable 3D body map with distinct clickable eyes and lungs, in addition to the existing body regions.
- Added five educational tabs to every body region: How to measure, Why it matters, Spaceflight hazards, When to escalate, and What to do. Added direct NASA / CSA evidence links beside each region's guidance.
- Reworked body-region content to distinguish symptoms, optional measurements and clinical assessment. Eyes cover SANS education; lungs display optional SpO2 without inventing a threshold; glucose is described as one metabolic measurement; exercise is described as a countermeasure rather than a bone-density measurement; temperature is not described as an immune-function measurement.
- Added a shortness-of-breath symptom option and mapped relevant reported symptoms to the eye, brain / balance and lung education panels. Symptom display is not a diagnosis.
- Added animated chart-line entry, subtle hover transitions and visual progress feedback across the dashboard. Reduced-motion preferences are respected.
- Refined mission communication labels for station, transit, Moon and Mars environments.
- Updated both frontend educational content and the backend `/api/content` JSON so they expose the same eight body regions and five educational tabs.

## Scientific references checked

The five supplied NASA / CSA resources remain linked in the Research panel: NASA HRP Hazards, NASA HRP Risks, NASA HRP Ongoing Research, CSA CANS radiation monitoring, and CSA's explanation of why space experiments are conducted. NASA's SANS and bone / exercise risk material was also checked to refine the eye and musculoskeletal guidance. The optional OSD-575 dataset remains explicitly labelled as a small research cohort, not a live wearable feed or personal clinical reference range.

## Important limitations retained

- AstroVitals is a hackathon prototype, not a medical device or diagnostic system.
- Existing numeric demonstration bands are not NASA-approved astronaut thresholds. No new SpO2, radiation, cabin CO2 or temperature thresholds were added.
- SpO2 is a spot estimate and is not a complete lung-function assessment. The body model is an educational illustration, not anatomical imaging.
- The journal is local-browser storage only. Its reminder is an in-app reminder while the dashboard is open, not an operating-system notification or a guaranteed intervention for isolation.
- CANS is described as an instrument under development; AstroVitals does not receive its live data.
- Environmental readings, personal check-ins and research-cohort data remain distinct.

## Validation performed

- Frontend production Webpack build completed successfully using the installed local Webpack executable.
- Backend content JSON parsed successfully and contains four environments, eight body regions and all five educational tabs.
- Maven was not installed in this environment, so backend Maven tests were not run.
- A full interactive browser / device test was not performed. Before submission, run `npm ci && npm run build` in `frontend` and `mvn verify` in `backend`, then manually test demo and API modes, each mission environment, body-region clicks, journal reminder and task completion.
