import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, Server } from 'lucide-react';
import { authApi } from '../api';

interface LoginPageProps {
  onLoginSuccess: (user: { username: string; email: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@windowscontrolcenter.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await authApi.login(email.trim(), password);
      const data = response.data;

      if (data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        const userObj = {
          username: data.user?.username || email.split('@')[0],
          email: data.user?.email || email,
        };
        localStorage.setItem('currentUser', JSON.stringify(userObj));
        onLoginSuccess(userObj);
      } else {
        setErrorMessage('Unexpected response from server: Missing access token.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        (err.response?.status === 401 ? 'Invalid email or password.' : null) ||
        (err.message?.includes('Network Error')
          ? 'Cannot reach API server (https://windowscontrolcenterapi.runasp.net). Ensure CORS and SQL database are online.'
          : 'Authentication failed. Please verify your credentials.');
      setErrorMessage(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@windowscontrolcenter.com');
    setPassword('Password123!');
    setErrorMessage(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 20%, rgba(30, 58, 138, 0.25) 0%, #0b0f19 80%)',
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '36px 32px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.1)',
          borderRadius: 16,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, var(--accent-blue), #1d4ed8)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
            }}
          >
            <Shield size={30} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px 0', letterSpacing: -0.5 }}>
            Windows Control Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
            Enterprise Fleet Telemetry & Management Platform
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 12,
              padding: '4px 10px',
              borderRadius: 20,
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              fontSize: 11,
              color: 'var(--accent-blue)',
            }}
          >
            <Server size={12} />
            <span>API: windowscontrolcenterapi.runasp.net</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--accent-red)',
              color: '#fca5a5',
              fontSize: 12.5,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <AlertCircle size={16} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email field */}
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
              Work Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                required
                className="input"
                style={{ width: '100%', paddingLeft: 38, boxSizing: 'border-box' }}
                placeholder="admin@windowscontrolcenter.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="input"
                style={{ width: '100%', paddingLeft: 38, paddingRight: 38, boxSizing: 'border-box' }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{
              marginTop: 8,
              height: 44,
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Quick autofill helper */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
            Default Administrator Credentials:
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={autofillAdmin}
            style={{ fontSize: 11.5, color: 'var(--accent-blue)', textDecoration: 'underline' }}
          >
            Use admin@windowscontrolcenter.com / Password123!
          </button>
        </div>
      </div>
    </div>
  );
};
