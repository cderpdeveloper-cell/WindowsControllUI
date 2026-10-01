import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle, Sliders, Plus, Filter, Check } from 'lucide-react';
import { Alert, AlertRule } from '../types';

interface AlertsPageProps {
  alerts: Alert[];
  rules: AlertRule[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onCreateRule: (rule: Partial<AlertRule>) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  rules,
  onAcknowledge,
  onResolve,
  onCreateRule,
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules'>('alerts');
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'Warning' | 'Info'>('All');

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter === 'All') return true;
    return a.severity === severityFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Fleet Health & Alerts</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>
          Proactive monitoring alerts, anomaly detection, and automated threshold policy triggers
        </p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Active & Historical Alerts ({alerts.length})
        </button>
        <button
          className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          Alert Rules & Thresholds ({rules.length})
        </button>
      </div>

      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['All', 'Critical', 'Warning', 'Info'] as const).map((sev) => (
              <button
                key={sev}
                className={`btn btn-sm ${severityFilter === sev ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSeverityFilter(sev)}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Endpoint</th>
                  <th>Alert Title</th>
                  <th>Description</th>
                  <th>Triggered Time</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>
                      <span
                        className={`status-badge ${
                          alert.severity === 'Critical'
                            ? 'offline'
                            : alert.severity === 'Warning'
                            ? 'warning'
                            : 'online'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{alert.computerName}</td>
                    <td style={{ fontWeight: 600 }}>{alert.title}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)', maxWidth: 300 }}>
                      {alert.message}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(alert.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: alert.status === 'Resolved' ? 'var(--accent-green)' : 'var(--accent-yellow)',
                        }}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {alert.status !== 'Resolved' && (
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={() => onAcknowledge(alert.id)}
                          >
                            Ack
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={() => onResolve(alert.id)}
                          >
                            Resolve
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Metric Monitored</th>
                <th>Trigger Condition</th>
                <th>Threshold Value</th>
                <th>Severity</th>
                <th>Enabled</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td style={{ fontWeight: 600 }}>{rule.name}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--accent-blue)' }}>
                    {rule.metricType}
                  </td>
                  <td>{rule.condition}</td>
                  <td style={{ fontWeight: 700 }}>{rule.threshold}%</td>
                  <td>
                    <span
                      className={`status-badge ${rule.severity === 'Critical' ? 'offline' : 'warning'}`}
                    >
                      {rule.severity}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: rule.isEnabled ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                      {rule.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
