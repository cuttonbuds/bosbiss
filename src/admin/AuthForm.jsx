import { useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function AuthForm() {
  const [mode, setMode] = useState('signin'); // signin | signup | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setMsg({ ok: true, text: data.session ? 'Account created.' : 'Account created. Check your inbox to confirm your email, then sign in.' });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin` });
        if (error) throw error;
        setMsg({ ok: true, text: 'Password reset email sent.' });
      }
    } catch (err) {
      setMsg({ ok: false, text: err.message || 'Something went wrong.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="admin-card auth" onSubmit={submit}>
      <p className="mono index">ADMIN</p>
      <h1 className="admin-title">
        {mode === 'signin' && 'Sign in'}
        {mode === 'signup' && 'Create admin account'}
        {mode === 'reset' && 'Reset password'}
      </h1>

      <div className="field">
        <label className="mono field-label" htmlFor="auth-email">Email</label>
        <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      {mode !== 'reset' && (
        <div className="field">
          <label className="mono field-label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password" type="password" required minLength={6}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      {msg && <p className={`auth-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</p>}

      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
      </button>

      <p className="auth-switch mono">
        {mode !== 'signin' && <button type="button" onClick={() => setMode('signin')}>Sign in</button>}
        {mode !== 'signup' && <button type="button" onClick={() => setMode('signup')}>Create account</button>}
        {mode !== 'reset' && <button type="button" onClick={() => setMode('reset')}>Forgot password</button>}
      </p>
      <p className="field-hint">Only emails listed in the <code>admins</code> table can edit content.</p>
    </form>
  );
}
