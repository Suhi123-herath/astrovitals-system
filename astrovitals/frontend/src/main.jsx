import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Auth from './components/Auth.jsx';
import {
  setDemoMode,
  initializeDemoData
} from './api.js';
import './styles.css';

const SESSION_KEY = 'astrovitals.demo.session.v1';

function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

// Restore demo mode before rendering the application.
const initialSession = readSession();

setDemoMode(Boolean(initialSession?.demo));

if (initialSession?.demo) {
  initializeDemoData();
}

function AuthGate() {
  const [session, setSession] = useState(initialSession);

  const login = (profile) => {
    setDemoMode(Boolean(profile.demo));

    if (profile.demo) {
      initializeDemoData();
    }

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify(profile)
    );

    setSession(profile);
  };

  const exploreDemo = () => {
    login({
      name: 'Alex Morgan',
      email: 'demo@astrovitals.space',
      crewId: 'DEMO-01',
      demo: true
    });
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setDemoMode(false);
    setSession(null);
  };

  return session ? (
    <App onLogout={logout} profile={session} />
  ) : (
    <Auth
      onAuthenticated={login}
      onExploreDemo={exploreDemo}
    />
  );
}

createRoot(document.getElementById('root')).render(
  <AuthGate />
);