import React from 'react';
import {
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  HardDrive,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Terminal,
  ShieldAlert,
  Radio,
  Layers
} from 'lucide-react';
import { Computer, Alert, DashboardStats } from '../types';

interface DashboardPageProps {
  computers: Computer[];
  stats: DashboardStats;
  alerts: Alert[];
  onSelectComputer: (comp: Computer) => void;
  onOpenAlerts: () => void;
  onOpenEnrollment: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  computers,
  stats,
  alerts,
  onSelectComputer,
  onOpenAlerts,
  onOpenEnrollment,
}) => {
  const onlineCount = computers.filter((c) => c.isOnline).length;
  const offlineCount = computers.filter((c) => !c.isOnline).length;
  const warningCount = computers.filter((c) => c.status === 'Warning').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Fleet Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: 1 }}>
            <Radio size={14} className="pulse" />
            CENTRALIZED WINDOWS FABRIC MANAGEMENT
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 4, letterSpacing: -0.5 }}>
            Enterprise Windows Fleet Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 650, marginTop: 4 }}>
            Real-time telemetry, remote PowerShell execution, and management across your Windows Servers, Active Directory Domain Controllers, Hyper-V Clusters, and Enterprise Workstations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, zIndex: 2 }}>
          <button className="btn btn-primary" onClick={onOpenEnrollment}>
            + Enroll Windows Agent
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Total Endpoints</div>
          <div className="stat-value blue">{computers.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>{onlineCount} Online</span> • <span>{offlineCount} Offline</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-label">Online Agents</div>
          <div className="stat-value green">{onlineCount}</div>
          <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>
            {Math.round((onlineCount / (computers.length || 1)) * 100)}% Fleet Availability
          </div>
        </div>

        <div className="stat-card yellow">
          <div className="stat-label">Active Warnings / Spikes</div>
          <div className="stat-value yellow">{warningCount + alerts.filter((a) => a.status === 'Active').length}</div>
          <div style={{ fontSize: 12, color: 'var(--accent-yellow)' }}>
            Requires admin attention
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-label">Average Fleet CPU</div>
          <div className="stat-value red">45.4%</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Avg Memory: 63.0%
          </div>
        </div>
      </div>

      {/* Main Grid: Active Endpoints & Critical Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Managed Windows Endpoints Quick Table */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Server size={18} color="var(--accent-blue)" />
              <span className="card-title">Live Windows Endpoints</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Click endpoint to launch full management console
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Computer Name</th>
                  <th>OS Edition</th>
                  <th>IP Address</th>
                  <th>CPU</th>
                  <th>Memory</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {computers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13 }}>No Windows endpoints connected yet.</span>
                        <button className="btn btn-primary btn-sm" onClick={onOpenEnrollment}>
                          + Enroll First Computer
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  computers.map((comp) => (
                  <tr
                    key={comp.id}
                    onClick={() => onSelectComputer(comp)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span className={`status-badge ${comp.isOnline ? 'online' : 'offline'}`}>
                        <span className={`status-dot ${comp.isOnline ? 'online' : 'offline'}`} />
                        {comp.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{comp.computerName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {comp.domainName || 'WORKGROUP'}
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{comp.osName}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{comp.ipAddress || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="progress-bar" style={{ width: 50, height: 6 }}>
                          <div
                            className="progress-fill blue"
                            style={{ width: `${comp.metrics?.cpuUsagePercent || 0}%` }}
                          />
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 600 }}>
                          {comp.metrics?.cpuUsagePercent || 0}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="progress-bar" style={{ width: 50, height: 6 }}>
                          <div
                            className="progress-fill green"
                            style={{ width: `${comp.metrics?.memoryUsagePercent || 0}%` }}
                          />
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 600 }}>
                          {comp.metrics?.memoryUsagePercent || 0}%
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '3px 8px', fontSize: 11 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComputer(comp);
                        }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert size={18} color="var(--accent-red)" />
              <span className="card-title">Fleet Alerts & Health</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onOpenAlerts} style={{ padding: '2px 8px', fontSize: 11 }}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)', fontSize: 13 }}>
                ✅ All systems nominal. No active alerts.
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: '12px 14px',
                  background: 'var(--bg-input)',
                  borderRadius: 8,
                  borderLeft: `4px solid ${
                    alert.severity === 'Critical'
                      ? 'var(--accent-red)'
                      : alert.severity === 'Warning'
                      ? 'var(--accent-yellow)'
                      : 'var(--accent-blue)'
                  }`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {alert.title}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: alert.severity === 'Critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                      color: alert.severity === 'Critical' ? 'var(--accent-red)' : 'var(--accent-yellow)',
                    }}
                  >
                    {alert.severity}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {alert.message}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Target: {alert.computerName}</span>
                  <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
};
