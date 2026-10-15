import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import Mark from '../components/Mark.jsx';
import { useTheme } from '../hooks.js';
import { PROFILE_FIELDS, COLLECTIONS } from './schema.js';
import ProfileEditor from './ProfileEditor.jsx';
import CollectionEditor from './CollectionEditor.jsx';
import AuthForm from './AuthForm.jsx';
import './admin.css';

const TABS = [{ key: 'profile', label: 'Profile' }, ...COLLECTIONS.map((c) => ({ key: c.table, label: c.label }))];

export default function Admin() {
  const [theme, toggleTheme] = useTheme();
  const [session, setSession] = useState(undefined); // undefined = unknown yet
  const [isAdmin, setIsAdmin] = useState(null);
  const [tab, setTab] = useState('profile');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  const signOut = () => supabase.auth.signOut();

  return (
    <div className="admin">
      <header className="admin-bar">
        <a href="/" className="brand" aria-label="Back to site">
          <Mark className="brand-mark" />
          <span className="brand-name">Dashboard</span>
        </a>
        <div className="admin-bar-right">
          {session && <span className="mono admin-user">{session.user.email}</span>}
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="theme-toggle-dot" />
            <span className="mono theme-toggle-label">{theme}</span>
          </button>
          {session && <button className="btn btn-ghost" type="button" onClick={signOut}>Sign out</button>}
        </div>
      </header>

      {session === undefined && <p className="mono admin-note">Checking session…</p>}

      {session === null && <AuthForm />}

      {session && isAdmin === false && (
        <div className="admin-card">
          <p className="admin-title">This account is not an admin.</p>
          <p className="muted">
            Signed in as <strong>{session.user.email}</strong>. Only emails listed in the
            <code> admins </code> table can edit content.
          </p>
        </div>
      )}

      {session && isAdmin && (
        <>
          <nav className="admin-tabs" aria-label="Content sections">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`admin-tab${tab === t.key ? ' active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
            <a className="mono admin-view" href="/" target="_blank" rel="noopener">View site ↗</a>
          </nav>

          <main className="admin-main">
            {tab === 'profile' ? (
              <ProfileEditor fields={PROFILE_FIELDS} />
            ) : (
              <CollectionEditor key={tab} config={COLLECTIONS.find((c) => c.table === tab)} />
            )}
          </main>
        </>
      )}
    </div>
  );
}
