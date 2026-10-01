import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsPageProps {
  logs: AuditLog[];
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter !== 'All' && log.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Security Audit Trail & Compliance</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>
          Immutable activity logging of all administrative PowerShell executions, service restarts, logins, and enrollments
        </p>
      </div>

      <div className="card" style={{ padding: '12px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div className="topbar-search" style={{ flex: 1 }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {['All', 'Automation', 'Services', 'ProcessManagement', 'AgentSecurity', 'Authentication'].map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 12, padding: '4px 10px' }}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Category</th>
              <th>Details & Execution Target</th>
              <th>Actor</th>
              <th>IP Origin</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{log.action}</td>
                <td>
                  <span
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'var(--bg-input)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {log.category}
                  </span>
                </td>
                <td style={{ fontSize: 13 }}>{log.details}</td>
                <td style={{ fontWeight: 550, color: 'var(--accent-blue)' }}>{log.userName}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{log.ipAddress || '127.0.0.1'}</td>
                <td>
                  <span className={`status-badge ${log.success ? 'online' : 'offline'}`} style={{ fontSize: 11 }}>
                    {log.success ? 'SUCCESS' : 'FAILED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
