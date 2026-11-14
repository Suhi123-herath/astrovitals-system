import { iso } from '../engine.js';

function Ring({ value, max = 100, label }) {
  const percent = Math.max(0, Math.min(100, (Number(value || 0) / max) * 100));
  return <span className="engagement-ring" style={{ '--progress': `${percent}%` }} aria-label={`${Math.round(percent)} percent ${label}`}><b>{Math.round(percent)}%</b></span>;
}

export default function MissionEngagement({ rows = [], gameState, journalProgress = { today: false, streak: 0 } }) {
  const today = rows.find((row) => row.date === iso());
  const exercise = Number(today?.exercise || 0);
  const meals = Number(today?.meals || 0);
  const tasks = [
    { id: 'checkin', icon: '◉', title: 'Daily health check-in', detail: today ? 'Today’s measurements are recorded' : 'Record today’s mission health observations', done: Boolean(today), progress: today ? 1 : 0, max: 1, href: '#checkin' },
    { id: 'exercise', icon: '✦', title: 'Exercise countermeasure', detail: `${Math.min(exercise, 30)} of 30 minutes logged`, done: exercise >= 30, progress: exercise, max: 30, href: '#checkin' },
    { id: 'nutrition', icon: '◇', title: 'Nutrition routine', detail: `${Math.min(meals, 3)} of 3 meals recorded`, done: meals >= 3, progress: meals, max: 3, href: '#checkin' },
    { id: 'journal', icon: '✎', title: 'Crew reflection', detail: journalProgress.today ? 'Today’s reflection saved' : 'Take a few minutes to reflect or connect', done: journalProgress.today, progress: journalProgress.today ? 1 : 0, max: 1, href: '#journal' },
  ];
  const completed = tasks.filter((task) => task.done).length;
  const exerciseDays = rows.filter((row) => Number(row.exercise || 0) >= 30).length;
  const achievements = [
    { id: 'streak3', icon: '🔥', name: '3-day streak', note: 'Check in on three consecutive days', value: gameState?.streak || 0, max: 3, unlocked: (gameState?.streak || 0) >= 3 },
    { id: 'streak7', icon: '🌟', name: '7-day streak', note: 'Build a week of check-in consistency', value: gameState?.streak || 0, max: 7, unlocked: (gameState?.streak || 0) >= 7 },
    { id: 'exercise', icon: '🏃', name: 'Exercise champion', note: 'Log five sessions of 30+ minutes', value: exerciseDays, max: 5, unlocked: exerciseDays >= 5 },
    { id: 'journal', icon: '📓', name: 'Reflection keeper', note: 'Write reflections on three consecutive days', value: journalProgress.streak || 0, max: 3, unlocked: (journalProgress.streak || 0) >= 3 },
    { id: 'mission', icon: '🚀', name: 'Full mission logged', note: 'Record 30 daily check-ins', value: rows.length, max: 30, unlocked: rows.length >= 30 },
  ];

  return (
    <section className="box mission-engagement" id="tasks">
      <div className="row between engagement-heading">
        <div><p className="eyebrow">MISSION ROUTINE</p><h2>Tasks & achievements</h2></div>
        <Ring value={completed} max={tasks.length} label="daily tasks complete" />
      </div>
      <p className="muted">Earn progress for consistent check-ins, countermeasures and reflection — never for having a particular health reading.</p>

      <div className="mission-task-list">
        {tasks.map((task) => (
          <a className={`mission-task ${task.done ? 'is-complete' : ''}`} href={task.href} key={task.id}>
            <span className="task-icon">{task.done ? '✓' : task.icon}</span>
            <span className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span>
            <Ring value={task.progress} max={task.max} label={task.title} />
          </a>
        ))}
      </div>

      <div className="achievement-heading"><span>ACHIEVEMENT BAY</span><small>{achievements.filter((item) => item.unlocked).length} / {achievements.length} unlocked</small></div>
      <div className="achievement-grid">
        {achievements.map((item) => (
          <article className={`achievement-card ${item.unlocked ? 'unlocked' : 'locked'}`} key={item.id}>
            <span className="achievement-icon">{item.unlocked ? item.icon : '🔒'}</span>
            <strong>{item.name}</strong>
            <small>{item.note}</small>
            <div className="achievement-progress"><i style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }} /></div>
            <span className="achievement-count">{Math.min(item.value, item.max)} / {item.max}</span>
          </article>
        ))}
      </div>
      <p className="micro-note">Achievements track participation only. They do not indicate medical fitness or health status.</p>
    </section>
  );
}
