import { useEffect, useMemo, useState } from 'react';

const ENTRY_KEY = 'astrovitals.crew-journal.v1';
const REMINDER_KEY = 'astrovitals.journal-reminder.v1';
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const PROMPTS = [
  'What felt most demanding today, and what helped you handle it?',
  'What helped you feel connected to your crew or people at home today?',
  'What went well during this mission day, even if it was something small?',
  'Is there anything you want the next shift or your crew to know?',
  'What is one thing you want to carry into tomorrow?'
];
function readEntries() {
  try { return JSON.parse(localStorage.getItem(ENTRY_KEY)) || {}; }
  catch { return {}; }
}
function readReminder() {
  try { return JSON.parse(localStorage.getItem(REMINDER_KEY)) || { enabled: false, time: '20:00' }; }
  catch { return { enabled: false, time: '20:00' }; }
}
function countStreak(entries) {
  const dates = new Set(Object.keys(entries));
  const d = new Date();
  if (!dates.has(todayKey())) d.setDate(d.getDate() - 1);
  let count = 0;
  while (dates.has(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)) {
    count += 1;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export default function Journal({ onProgress }) {
  const today = todayKey();
  const [entries, setEntries] = useState(readEntries);
  const [draft, setDraft] = useState(() => readEntries()[today]?.text || '');
  const [reminder, setReminder] = useState(readReminder);
  const [reminderDue, setReminderDue] = useState(false);
  const [message, setMessage] = useState('');
  const prompt = useMemo(() => PROMPTS[new Date().getDate() % PROMPTS.length], []);
  const streak = countStreak(entries);
  const completedToday = Boolean(entries[today]?.text);

  useEffect(() => {
    onProgress?.({ today: completedToday, streak });
  }, [completedToday, streak, onProgress]);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setReminderDue(Boolean(reminder.enabled && current >= reminder.time && !entries[todayKey()]));
    };
    check();
    const timer = window.setInterval(check, 30000);
    return () => window.clearInterval(timer);
  }, [reminder, entries]);

  const saveReminder = (next) => {
    setReminder(next);
    localStorage.setItem(REMINDER_KEY, JSON.stringify(next));
  };

  const saveEntry = (event) => {
    event.preventDefault();
    if (!draft.trim()) {
      setMessage('Write a short reflection before saving.');
      return;
    }
    const next = { ...entries, [today]: { text: draft.trim(), updatedAt: new Date().toISOString() } };
    setEntries(next);
    localStorage.setItem(ENTRY_KEY, JSON.stringify(next));
    setMessage('Reflection saved on this device.');
  };

  return (
    <section className="box crew-journal" id="journal">
      <div className="row between journal-heading">
        <div><p className="eyebrow">CREW WELLBEING</p><h2>Mission journal</h2></div>
        <span className={`badge ${completedToday ? 'journal-done' : ''}`}>{completedToday ? 'Today logged' : 'Daily reflection'}</span>
      </div>
      <p className="muted">A private space to reflect, notice stressors and plan crew connection. Journaling is a supportive habit, not a treatment or a substitute for crew / medical support.</p>

      {reminderDue && <div className="journal-reminder-alert" role="status">✦ Your journal reminder is due. Take a few minutes to reflect or connect with a crewmate.</div>}

      <div className="journal-prompt">
        <span>✧ TODAY'S REFLECTION PROMPT</span>
        <strong>{prompt}</strong>
      </div>
      <form onSubmit={saveEntry}>
        <label className="journal-label" htmlFor="journal-entry">Your reflection</label>
        <textarea id="journal-entry" rows="4" maxLength="1500" value={draft} onChange={(e) => { setDraft(e.target.value); setMessage(''); }} placeholder="Write a few lines. You can keep it brief..." />
        <div className="journal-actions">
          <small>{draft.length}/1500 characters · Stored in this browser only</small>
          <button type="submit">{completedToday ? 'Update reflection' : 'Save reflection'}</button>
        </div>
        {message && <p className="micro-note" role="status">{message}</p>}
      </form>

      <div className="journal-bottom">
        <div className="journal-streak"><span className="journal-orbit">✧</span><div><strong>{streak}-day reflection streak</strong><small>Consistency, not emotional scores, earns progress.</small></div></div>
        <div className="journal-reminder-settings">
          <label><input type="checkbox" checked={reminder.enabled} onChange={(e) => saveReminder({ ...reminder, enabled: e.target.checked })} /> Daily in-app reminder</label>
          <input aria-label="Reminder time" type="time" value={reminder.time} onChange={(e) => saveReminder({ ...reminder, time: e.target.value })} disabled={!reminder.enabled} />
        </div>
      </div>
      <p className="micro-note">Reminder appears while AstroVitals is open. Journal entries and reminder settings stay in this browser; they are not sent to the Spring Boot backend.</p>
    </section>
  );
}
