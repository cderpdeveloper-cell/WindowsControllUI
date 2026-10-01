import React, { useState } from 'react';
import {
  Server,
  Search,
  Filter,
  RefreshCw,
  LayoutGrid,
  List,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Cpu,
  HardDrive,
  Activity,
  Terminal,
  Shield,
  Clock,
  MoreVertical
} from 'lucide-react';
import { Computer } from '../types';

interface ComputersPageProps {
  computers: Computer[];
  onSelectComputer: (comp: Computer) => void;
  onRefresh: () => void;
  onOpenEnrollment: () => void;
}

export const ComputersPage: React.FC<ComputersPageProps> = ({
  computers,
  onSelectComputer,
  onRefresh,
  onOpenEnrollment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Online' | 'Offline' | 'Warning'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = computers.filter((c) => {
    const matchesSearch =
      c.computerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.ipAddress && c.ipAddress.includes(searchTerm)) ||
      (c.osName && c.osName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.domainName && c.domainName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Online') return c.isOnline;
    if (statusFilter === 'Offline') return !c.isOnline;
    if (statusFilter === 'Warning') return c.status === 'Warning';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Managed Windows Endpoints</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>
            {computers.length} endpoints enrolled • {computers.filter((c) => c.isOnline).length} online and actively reporting telemetry
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={onRefresh}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenEnrollment}>
            + Enroll Endpoint
          </button>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div
        className="card"
        style={{
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 280 }}>
          <div className="topbar-search" style={{ flex: 1, minWidth: 220 }}>
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by name, IP, OS build, domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {(['All', 'Online', 'Offline', 'Warning'] as const).map((filter) => (
              <button
                key={filter}
                className={`btn btn-sm ${statusFilter === filter ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '5px 12px', fontSize: 12 }}
                onClick={() => setStatusFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
            style={{ background: viewMode === 'grid' ? 'var(--bg-hover)' : 'transparent' }}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
            style={{ background: viewMode === 'table' ? 'var(--bg-hover)' : 'transparent' }}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Grid or Table or Empty View */}
      {filtered.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '54px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            borderRadius: 12,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            🖥️
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {computers.length === 0 ? 'No Windows Endpoints Enrolled' : 'No Matching Computers'}
          </div>
          <div style={{ color: 'var(--text-secondary)', maxWidth: 440, fontSize: 13.5, lineHeight: 1.5 }}>
            {computers.length === 0
              ? 'Your fleet is currently empty. Run your Windows Agent with your enrollment token to connect and stream live telemetry.'
              : 'Try clearing your search query or changing your status filter.'}
          </div>
          {computers.length === 0 && (
            <button className="btn btn-primary" onClick={onOpenEnrollment} style={{ marginTop: 8 }}>
              + Enroll First Computer
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((comp) => (
            <div
              key={comp.id}
              className="card"
              onClick={() => onSelectComputer(comp)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: comp.isOnline ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${comp.isOnline ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}
                  >
                    🖥️
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{comp.computerName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {comp.domainName || 'WORKGROUP'}
                    </div>
                  </div>
                </div>

                <span className={`status-badge ${comp.isOnline ? 'online' : 'offline'}`}>
                  <span className={`status-dot ${comp.isOnline ? 'online' : 'offline'}`} />
                  {comp.status}
                </span>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {comp.osName}
              </div>

              {/* Mini telemetry progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg-input)', padding: 10, borderRadius: 8 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>CPU Utilization</span>
                    <span style={{ fontWeight: 600 }}>{comp.metrics?.cpuUsagePercent || 0}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div
                      className="progress-fill blue"
                      style={{ width: `${comp.metrics?.cpuUsagePercent || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Memory (RAM)</span>
                    <span style={{ fontWeight: 600 }}>{comp.metrics?.memoryUsagePercent || 0}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div
                      className="progress-fill green"
                      style={{ width: `${comp.metrics?.memoryUsagePercent || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                <span>IP: {comp.ipAddress || '—'}</span>
                <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Open Console →</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Computer Name</th>
                <th>Domain</th>
                <th>OS & Version</th>
                <th>IP Address</th>
                <th>CPU %</th>
                <th>Memory %</th>
                <th>Uptime</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((comp) => (
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
                  <td style={{ fontWeight: 600 }}>{comp.computerName}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {comp.domainName || 'WORKGROUP'}
                  </td>
                  <td style={{ fontSize: 12 }}>{comp.osName}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{comp.ipAddress || '—'}</td>
                  <td>{comp.metrics?.cpuUsagePercent || 0}%</td>
                  <td>{comp.metrics?.memoryUsagePercent || 0}%</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {comp.uptimeSeconds ? `${Math.floor(comp.uptimeSeconds / 86400)}d` : '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectComputer(comp);
                      }}
                    >
                      Manage
                    </button>
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
