import React, { useState } from 'react';
import { Settings, Shield, Server, Database, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [serverUrl, setServerUrl] = useState('http://windowscontrolcenterapi.runasp.net');
  const [telemetryInterval, setTelemetryInterval] = useState(15);
  const [heartbeatTimeout, setHeartbeatTimeout] = useState(60);
  const [orgName, setOrgName] = useState('Contoso Enterprise Systems');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Platform Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>
          Configure Windows Control Center cluster, SignalR gateway, and tenant defaults
        </p>
      </div>

      {saved && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--accent-green)',
            color: 'var(--accent-green)',
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Check size={16} />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card-header">
          <span className="card-title">Cluster & Agent Configuration</span>
        </div>

        <div className="form-group">
          <label className="input-label">Organization Name</label>
          <input
            type="text"
            className="input"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="input-label">Public Server API & SignalR Gateway URL</label>
          <input
            type="text"
            className="input"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="input-label">Real-time Telemetry Collection (Seconds)</label>
            <input
              type="number"
              className="input"
              value={telemetryInterval}
              onChange={(e) => setTelemetryInterval(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="input-label">Agent Offline Threshold (Seconds)</label>
            <input
              type="number"
              className="input"
              value={heartbeatTimeout}
              onChange={(e) => setHeartbeatTimeout(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button type="submit" className="btn btn-primary">
            <Save size={14} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
