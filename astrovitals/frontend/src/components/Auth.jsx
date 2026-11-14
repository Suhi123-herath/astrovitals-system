import { useState } from 'react';

function SpaceIllustration() {
  return (
    <svg className="auth-astronaut" viewBox="0 0 520 520" role="img" aria-label="Illustration of an astronaut floating in space">
      <defs>
        <linearGradient id="suit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4f8ff"/><stop offset="1" stopColor="#91b6df"/></linearGradient>
        <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#79e1ff"/><stop offset=".55" stopColor="#315b9a"/><stop offset="1" stopColor="#17284c"/></linearGradient>
        <radialGradient id="planet"><stop offset="0" stopColor="#a78bfa"/><stop offset="1" stopColor="#4f46a5"/></radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="390" cy="135" r="77" fill="url(#planet)" opacity=".9"/>
      <ellipse cx="390" cy="135" rx="117" ry="24" fill="none" stroke="#b6a6ff" strokeWidth="9" opacity=".65" transform="rotate(-22 390 135)"/>
      <g fill="#fff"><circle cx="85" cy="95" r="3"/><circle cx="170" cy="50" r="2"/><circle cx="450" cy="285" r="3"/><circle cx="90" cy="340" r="2"/><circle cx="355" cy="420" r="2"/><circle cx="465" cy="65" r="2"/><circle cx="230" cy="420" r="3"/></g>
      <g filter="url(#glow)" transform="translate(28 20) rotate(-12 245 250)">
        <path d="M160 265 L88 330 Q72 348 91 364 L123 380 Q139 387 150 369 L213 307Z" fill="url(#suit)" stroke="#dceaff" strokeWidth="5"/>
        <path d="M328 263 L398 322 Q416 340 401 358 L370 380 Q353 390 338 371 L280 309Z" fill="url(#suit)" stroke="#dceaff" strokeWidth="5"/>
        <path d="M188 342 L162 426 Q157 451 182 458 L215 463 Q235 466 241 444 L258 360Z" fill="url(#suit)" stroke="#dceaff" strokeWidth="5"/>
        <path d="M286 342 L311 426 Q317 451 292 458 L260 463 Q240 466 234 444 L217 360Z" fill="url(#suit)" stroke="#dceaff" strokeWidth="5"/>
        <rect x="176" y="190" width="150" height="188" rx="62" fill="url(#suit)" stroke="#e8f2ff" strokeWidth="6"/>
        <rect x="202" y="262" width="99" height="66" rx="13" fill="#25466f" stroke="#7dd3fc" strokeWidth="4"/>
        <path d="M220 293h20m10 0h27" stroke="#77e3ff" strokeWidth="5" strokeLinecap="round"/>
        <rect x="210" y="145" width="84" height="70" rx="25" fill="#dceaff"/>
        <circle cx="252" cy="145" r="83" fill="url(#suit)" stroke="#f3f8ff" strokeWidth="8"/>
        <circle cx="252" cy="145" r="63" fill="url(#visor)" stroke="#6dd5ff" strokeWidth="7"/>
        <path d="M210 120 Q235 88 275 102" fill="none" stroke="#d6f6ff" strokeWidth="8" strokeLinecap="round" opacity=".7"/>
        <rect x="151" y="245" width="34" height="62" rx="13" fill="#dceaff" stroke="#fff" strokeWidth="4"/>
        <rect x="326" y="245" width="34" height="62" rx="13" fill="#dceaff" stroke="#fff" strokeWidth="4"/>
        <circle cx="252" cy="295" r="11" fill="#60d5ff"/>
      </g>
      <path d="M65 235 Q110 205 142 226" fill="none" stroke="#8be5ff" strokeWidth="2" strokeDasharray="5 8" opacity=".8"/>
    </svg>
  );
}

export default function Auth({ onAuthenticated, onExploreDemo }) {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [crewId, setCrewId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const switchMode = (next) => { setMode(next); setError(''); setMessage(''); };

  const submit = (e) => {
    e.preventDefault(); setError(''); setMessage('');
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    if (mode === 'forgot') return setMessage('Password recovery is not connected yet. Add a backend email-reset service before launch.');
    if (password.length < 8) return setError('Use a password with at least 8 characters.');
    if (mode === 'register') {
      if (!name.trim()) return setError('Enter your name.');
      if (!crewId.trim()) return setError('Enter your astronaut / crew ID.');
      if (password !== confirm) return setError('Your passwords do not match.');
      onAuthenticated({ email: email.trim(), name: name.trim(), crewId: crewId.trim() });
      return;
    }
    onAuthenticated({ email: email.trim(), name: email.split('@')[0], crewId: crewId.trim() || 'DEMO-01' });
  };

  return (
    <main className="auth-shell">
      <div className="auth-stars" aria-hidden="true" />
      <section className="auth-showcase">
        <div className="auth-brand"><span className="auth-brand-icon">✦</span><span>ASTRO<span>VITALS</span></span></div>
        <div className="auth-copy">
          <div className="auth-kicker"><span /> MISSION HEALTH SYSTEM · ONLINE</div>
          <h1>Your health.<br/><em>Your mission.</em></h1>
          <p>Personal health monitoring for the explorers who go beyond Earth.</p>
        </div>
        <SpaceIllustration />
        <div className="auth-orbit-note"><span>✧</span><div><strong>MISSION CONTROL</strong><small>Every signal matters. Every crew member counts.</small></div></div>
        <div className="auth-footer">ASTROVITALS · CREW HEALTH INTERFACE <span>v1.0</span></div>
      </section>

      <section className="auth-panel-wrap">
        <div className="auth-panel">
          <div className="auth-panel-top"><span className="auth-live-dot"/> DEMO CREW ACCESS <span className="auth-panel-code">AV / 026</span></div>
          <div className="auth-heading">
            <div className="auth-symbol">⌁</div>
            <h2>{mode === 'signin' ? 'Welcome back, astronaut' : mode === 'register' ? 'Join the mission' : 'Reset access'}</h2>
            <p>{mode === 'signin' ? 'Sign in to access your personal health dashboard.' : mode === 'register' ? 'Create your crew profile to get started.' : 'Enter your email to begin account recovery.'}</p>
          </div>

          {mode !== 'forgot' && <div className="auth-mode-tabs"><button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => switchMode('signin')}>SIGN IN</button><button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>REGISTER</button></div>}

          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && <>
              <label>FULL NAME<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex Morgan" autoComplete="name" required/></label>
              <label>ASTRONAUT / CREW ID<input value={crewId} onChange={e => setCrewId(e.target.value)} placeholder="e.g. CREW-204" required/></label>
            </>}
            <label>EMAIL ADDRESS<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@mission.org" autoComplete="email" required/></label>
            {mode !== 'forgot' && <label>PASSWORD<div className="auth-password"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required/><button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'HIDE' : 'SHOW'}</button></div></label>}
            {mode === 'register' && <label>CONFIRM PASSWORD<input type={showPassword ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password" required/></label>}
            {mode === 'signin' && <div className="auth-forgot"><button type="button" onClick={() => switchMode('forgot')}>Forgot password?</button></div>}
            {error && <p className="auth-error" role="alert">{error}</p>}
            {message && <p className="auth-message" role="status">{message}</p>}
            <button className="auth-submit" type="submit">{mode === 'signin' ? 'ENTER MISSION CONTROL' : mode === 'register' ? 'CREATE CREW PROFILE' : 'REQUEST PASSWORD RESET'} <span>↗</span></button>
          </form>
          {mode === 'forgot' && <p className="auth-back"><button type="button" onClick={() => switchMode('signin')}>← Back to sign in</button></p>}
          {mode === 'signin' && (
            <div className="auth-demo-access">
              <div className="auth-demo-divider">
                <span>OR</span>
              </div>

              <button
                type="button"
                className="auth-demo-button"
                onClick={onExploreDemo}
              >
                <span>✦</span>
                Explore Demo — No Sign In Required
                <span>↗</span>
              </button>

              <p>
                Explore a sample astronaut dashboard with simulated mission data.
                No account or password required.
              </p>
            </div>
          )}
          {mode === 'signin' && <p className="auth-register-note">New to AstroVitals? <button type="button" onClick={() => switchMode('register')}>Create your crew account</button></p>}
          <div className="auth-security"><span>◈</span> BROWSER-ONLY DEMO PROFILE · NOT PRODUCTION AUTH</div>
        </div>
        <p className="auth-legal">Hackathon demo access only. This prototype does not provide production authentication or secure medical-record storage.</p>
      </section>
    </main>
  );
}
