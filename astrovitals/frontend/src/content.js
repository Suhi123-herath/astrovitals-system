// Educational content grounded in NASA HRP and CSA resources.
// This content explains risks and self-observation; it does not define clinical limits.
export const ENVS = [
  { id: 'station', name: 'Space station', delay: false, commsLabel: 'Near-real-time ground contact', note: 'Microgravity in a closed habitat, with relatively frequent ground communication.', focus: ['Altered gravity', 'Closed environment', 'Sleep and cardiovascular adaptation'] },
  { id: 'transit', name: 'Spacecraft in transit', delay: true, commsLabel: 'Delayed ground communications', note: 'Deep-space transit increases isolation, radiation exposure and communication delays.', focus: ['Radiation', 'Isolation and confinement', 'Distance from Earth'] },
  { id: 'moon', name: 'Moon base', delay: false, commsLabel: 'Short lunar communication delay', note: 'Lunar surface operations combine partial gravity, radiation exposure and habitat constraints.', focus: ['Altered gravity', 'Radiation', 'Hostile / closed environment'] },
  { id: 'mars', name: 'Mars base', delay: true, commsLabel: 'Delayed ground communications', note: 'Mars missions involve partial gravity, deep-space radiation, isolation and delayed communication.', focus: ['Radiation', 'Autonomous medical support', 'Isolation', 'Altered gravity'] },
];

export const TABS = [
  ['measure', 'How to measure'], ['why', 'Why it matters'], ['hazards', 'Spaceflight hazards'],
  ['escalate', 'When to escalate'], ['act', 'What to do'],
];

export const REGIONS = [
  { id: 'eyes', name: 'Eyes and vision', inds: [], symptoms: ['Vision changes'], sources: ['nasa-risks', 'nasa-research'], tabs: {
    measure: 'Record new blurred vision, difficulty focusing, double vision or other changes, including when they began. Complete any eye checks only with mission-approved equipment and instructions; clinical eye assessment may require trained personnel.',
    why: 'NASA studies Spaceflight-Associated Neuro-ocular Syndrome (SANS), in which the structure of the eyes and brain can change during spaceflight. Self-reported symptoms do not diagnose SANS.',
    hazards: 'NASA identifies SANS as a spaceflight health risk. Weightlessness can shift blood and cerebrospinal fluid toward the head and contribute to eye and brain changes; do not assume a symptom identifies its cause.',
    escalate: 'Report new, persistent or worsening vision changes to the crew medical officer / flight surgeon. Sudden vision loss, severe eye pain or vision changes with severe headache or neurological symptoms require immediate onboard medical procedures.',
    act: 'Record the symptom and onset, tell the crew, and follow the mission eye-assessment plan. Do not self-diagnose or change medication.'
  } },
  { id: 'brain', name: 'Brain, sleep and balance', inds: ['sleep', 'mood'], symptoms: ['Dizziness', 'Nausea'], sources: ['nasa-hazards', 'nasa-risks', 'nasa-research'], tabs: {
    measure: 'Log sleep duration and a daily mood rating. Also record dizziness, nausea, headache, unusual fatigue or balance / coordination changes when present.',
    why: 'Sleep, mood, alertness and sensorimotor performance can affect wellbeing and the ability to perform mission tasks. Mood ratings are self-reports, not a psychiatric assessment.',
    hazards: 'Isolation and confinement, workload, circadian disruption and altered gravity can affect sleep, behaviour, balance and hand-eye or gait coordination.',
    escalate: 'Report persistent sleep disruption, falling mood, repeated dizziness or coordination problems. Thoughts of self-harm, severe confusion or inability to function require immediate crew support and onboard emergency procedures.',
    act: 'Use the mission sleep schedule, plan crew connection time, record symptoms and discuss persistent changes with the crew medical officer.'
  } },
  { id: 'heart', name: 'Heart and blood pressure', inds: ['hr', 'sys', 'dia'], sources: ['nasa-risks', 'nasa-research'], tabs: {
    measure: 'Use the mission-approved pulse sensor or blood-pressure cuff. For a resting measurement, follow the device protocol, keep the arm positioned as instructed, and record heart rate plus both systolic and diastolic values with activity context.',
    why: 'Weightlessness changes fluid distribution, blood circulation and how the heart and blood vessels function. Trends are useful context but do not diagnose cardiovascular disease.',
    hazards: 'Altered gravity is a key context for cardiovascular adaptation. Exercise, workload, hydration, illness and measurement conditions can also affect readings.',
    escalate: 'Follow mission-approved limits and personal medical instructions. Report repeated unusual readings or a marked change from baseline. Chest pain, fainting or severe shortness of breath require immediate onboard emergency procedures.',
    act: 'Record the reading and context, repeat only as directed by the onboard protocol, and contact the crew medical officer when indicated. Do not change medication or exercise plans independently.'
  } },
  { id: 'lungs', name: 'Lungs and oxygenation', inds: [], measurements: [{ key: 'spo2', label: 'SpO₂', unit: '%' }], symptoms: ['Shortness of breath', 'Severe shortness of breath'], sources: ['nasa-hazards', 'nasa-risks'], tabs: {
    measure: 'If a mission-approved pulse oximeter is available, use it exactly as instructed and record the value, time and activity context. Also record breathing difficulty. SpO₂ is an estimate of peripheral oxygen saturation, not a complete lung-function test.',
    why: 'Oxygenation is important to health and performance. A pulse-oximeter value must be interpreted with symptoms, device limitations and mission-specific clinical guidance.',
    hazards: 'NASA identifies hypoxia as a human-spaceflight risk. Suit operations, pressure changes and spacecraft atmosphere management are relevant contexts. Cabin CO₂ is an environmental measurement, not an SpO₂ reading.',
    escalate: 'New or worsening breathing difficulty, fainting, confusion or chest pain requires immediate crew assessment and the onboard emergency protocol. For other abnormal readings, use mission-approved limits rather than a universal app threshold.',
    act: 'Alert the crew, record the reading and symptoms, and follow the onboard medical and environmental procedures. Never adjust oxygen or cabin systems based only on this app.'
  } },
  { id: 'blood', name: 'Metabolic health: glucose', inds: ['glucose'], sources: ['nasa-risks', 'csa-science'], tabs: {
    measure: 'Use the approved glucose meter and mission procedure. Record the value, time and whether it was fasting / before a meal or after a meal.',
    why: 'Glucose is one metabolic measurement. It does not represent overall blood health and must be interpreted in the context of meals, medication and clinical guidance.',
    hazards: 'Food availability, nutrition, workload, stress and mission conditions can influence metabolic health. NASA identifies adequate food and nutrition as a human-spaceflight risk area.',
    escalate: 'Use the astronaut’s prescribed care plan and mission-approved glucose limits. Repeated out-of-range readings or symptoms should be reported; confusion or severe illness requires immediate medical support.',
    act: 'Record meal timing and symptoms, follow the prescribed nutrition and treatment plan, and contact the crew medical officer when indicated.'
  } },
  { id: 'skin', name: 'Skin and temperature', inds: ['temp'], sources: ['nasa-risks', 'nasa-research'], tabs: {
    measure: 'Use the approved thermometer according to its instructions. Record the measurement method, time and symptoms; avoid comparing readings taken with different methods as if they were identical.',
    why: 'Temperature can contribute to an assessment when someone feels unwell, but temperature alone cannot measure immune function or confirm an infection.',
    hazards: 'NASA studies altered immune responses and host-microorganism interactions. Shared, closed habitats make hygiene, symptom reporting and environmental controls important.',
    escalate: 'Report persistent temperature changes or signs of illness using mission medical guidance. Breathing difficulty, confusion or rapid deterioration requires immediate onboard assessment.',
    act: 'Record symptoms, follow hygiene and onboard infection-control procedures, and seek crew medical advice rather than relying on temperature alone.'
  } },
  { id: 'bones', name: 'Bones and muscles', inds: ['exercise'], sources: ['nasa-risks', 'nasa-research'], tabs: {
    measure: 'Log completed aerobic and resistance exercise separately when possible, including duration and any pain or difficulty. Exercise minutes are an activity record, not a measurement of bone density or muscle strength.',
    why: 'Reduced loading in microgravity can contribute to bone and muscle changes. NASA studies exercise countermeasures to help preserve fitness and performance.',
    hazards: 'Altered gravity changes the loads placed on bones and muscles. Mission duration, exercise prescription and nutrition are relevant factors.',
    escalate: 'Report persistent pain, injury, unusual weakness or repeated inability to complete the prescribed programme. Suspected serious injury requires onboard medical assessment.',
    act: 'Follow the mission-specific exercise and nutrition plan. Do not increase training load or exercise through pain without medical guidance.'
  } },
  { id: 'stomach', name: 'Nutrition and digestion', inds: ['meals'], sources: ['nasa-risks', 'nasa-research', 'csa-science'], tabs: {
    measure: 'Record meals and, when available, appetite, food intake, hydration and body-mass trends using the mission’s approved procedures. Meal count alone does not measure nutritional adequacy.',
    why: 'Adequate nutrition supports health and mission performance. Food acceptability, appetite and nutrient intake are relevant to long-duration missions.',
    hazards: 'Closed food systems, limited variety, storage constraints and changes in appetite can affect nutrition during missions.',
    escalate: 'Report persistent appetite loss, repeated vomiting, inability to eat or drink, or concerning weight changes to the crew medical officer.',
    act: 'Follow the approved nutrition and hydration plan, record symptoms and intake, and discuss persistent difficulties with the crew medical officer.'
  } },
];

// NASA / CSA references provide scientific context, not patient-specific thresholds.
export const RESEARCH = [
  { id: 'nasa-hazards', agency: 'NASA HRP', title: 'Five Hazards of Human Spaceflight', domain: 'Mission hazards', summary: 'NASA groups hazards into space radiation, isolation and confinement, distance from Earth, gravity fields, and hostile / closed environments. These hazards can interact.', url: 'https://www.nasa.gov/hrp/hazards/', supports: ['Mission context', 'Cross-hazard interpretation'] },
  { id: 'nasa-risks', agency: 'NASA HRP', title: 'Risks of Human Spaceflight', domain: 'Health-risk framework', summary: 'Describes physiological, behavioural-performance and radiation risks, including cardiovascular adaptation, altered immune response, vestibular changes, SANS, bone changes, sleep and behavioural health.', url: 'https://www.nasa.gov/hrp/risks/', supports: ['Cardiovascular', 'Immune', 'SANS', 'Vestibular', 'Sleep'] },
  { id: 'nasa-research', agency: 'NASA HRP', title: 'Ongoing HRP Research', domain: 'Monitoring approaches', summary: 'Examples include activity and sleep monitoring, immune biomarkers, standard measures, eye / brain research, exercise countermeasures and telemedicine studies.', url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/', supports: ['Sleep', 'Activity', 'Immune biomarkers', 'Integrated health data'] },
  { id: 'csa-radiation', agency: 'Canadian Space Agency', title: 'Monitoring Radiation for Astronaut Health', domain: 'Environmental exposure', summary: 'Describes development of CANS, an autonomous instrument designed to continuously measure neutron radiation exposure. The article does not provide a live sensor feed to AstroVitals.', url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp', supports: ['Radiation dosimetry', 'Environmental sensors'] },
  { id: 'csa-science', agency: 'Canadian Space Agency', title: 'Why conduct science experiments in space?', domain: 'Scientific motivation', summary: 'Explains how space experiments help characterize human health risks, develop countermeasures, prepare for deep-space missions and improve health knowledge on Earth.', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', supports: ['Research rationale', 'Countermeasures'] },
  { id: 'osd-575', agency: 'NASA OSDR', title: 'OSD-575: Inspiration4 serum metabolic and immune/cardiac cytokine arrays', domain: 'Research dataset', summary: 'A three-day Inspiration4 study of four crew members with pre- and post-flight serum metabolic and multiplex cytokine profiling. It is a research dataset, not a live wearable feed or a personal clinical reference range.', url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-575', supports: ['Metabolic research', 'Immune / cardiac biomarkers'] },
];
