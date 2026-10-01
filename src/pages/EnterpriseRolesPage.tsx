import React, { useState } from 'react';
import {
  Layers,
  Database,
  Globe,
  Server,
  Play,
  Square,
  RotateCcw,
  CheckCircle,
  RefreshCw,
  Search,
  Sliders,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { MOCK_HYPERV_VMS, MOCK_IIS_SITES } from '../services/dataService';
import { HyperVVM, IISSite } from '../types';

export const EnterpriseRolesPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'iis' | 'hyperv' | 'sql' | 'ad'>('iis');
  const [vms, setVms] = useState<HyperVVM[]>(MOCK_HYPERV_VMS);
  const [iisSites, setIisSites] = useState<IISSite[]>(MOCK_IIS_SITES);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleToggleVm = (vmId: string, currentState: string) => {
    const nextState = currentState === 'Running' ? 'Off' : 'Running';
    setVms(vms.map((v) => (v.vmId === vmId ? { ...v, state: nextState as any } : v)));
    showStatus(`${nextState === 'Running' ? 'Power ON' : 'Power OFF'} triggered for Hyper-V VM.`);
  };

  const handleToggleSite = (siteId: number, currentState: string) => {
    const nextState = currentState === 'Started' ? 'Stopped' : 'Started';
    setIisSites(iisSites.map((s) => (s.id === siteId ? { ...s, state: nextState as any } : s)));
    showStatus(`IIS Site state toggled to: ${nextState}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Enterprise Windows Roles & Workloads</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>
            Centralized orchestration of IIS Web Farms, Hyper-V Hypervisors, SQL Server Instances, and Active Directory
          </p>
        </div>
      </div>

      {statusMsg && (
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
          <CheckCircle size={16} />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Role Switcher Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeRole === 'iis' ? 'active' : ''}`}
          onClick={() => setActiveRole('iis')}
        >
          <Globe size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
          IIS Web Sites & App Pools
        </button>
        <button
          className={`tab ${activeRole === 'hyperv' ? 'active' : ''}`}
          onClick={() => setActiveRole('hyperv')}
        >
          <Layers size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
          Hyper-V Virtual Machines ({vms.length})
        </button>
        <button
          className={`tab ${activeRole === 'sql' ? 'active' : ''}`}
          onClick={() => setActiveRole('sql')}
        >
          <Database size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
          SQL Server Clustered Instances
        </button>
        <button
          className={`tab ${activeRole === 'ad' ? 'active' : ''}`}
          onClick={() => setActiveRole('ad')}
        >
          <ShieldCheck size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
          Active Directory Domain Services
        </button>
      </div>

      {/* ROLE 1: IIS MANAGEMENT */}
      {activeRole === 'iis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', margin: 0 }}>
              <span className="card-title">Configured IIS Web Sites on APP-PROD-IIS02</span>
              <button className="btn btn-ghost btn-sm" onClick={() => showStatus('Refreshed IIS status')}>
                <RefreshCw size={13} />
                <span>Refresh Sites</span>
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Site Name</th>
                  <th>Assigned App Pool</th>
                  <th>Bindings</th>
                  <th>Physical Path</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {iisSites.map((site) => (
                  <tr key={site.id}>
                    <td>
                      <span className={`status-badge ${site.state === 'Started' ? 'online' : 'offline'}`}>
                        <span className={`status-dot ${site.state === 'Started' ? 'online' : 'offline'}`} />
                        {site.state}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{site.name}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--accent-purple)' }}>{site.appPool}</td>
                    <td>
                      {site.bindings.map((b) => (
                        <span
                          key={b}
                          style={{
                            display: 'inline-block',
                            background: 'var(--bg-input)',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            marginRight: 4,
                          }}
                        >
                          {b}
                        </span>
                      ))}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{site.physicalPath}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className={`btn btn-sm ${site.state === 'Started' ? 'btn-danger' : 'btn-success'}`}
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          onClick={() => handleToggleSite(site.id, site.state)}
                        >
                          {site.state === 'Started' ? 'Stop' : 'Start'}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          onClick={() => showStatus(`Recycled Application Pool: ${site.appPool}`)}
                        >
                          Recycle Pool
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROLE 2: HYPER-V VM MANAGEMENT */}
      {activeRole === 'hyperv' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', margin: 0 }}>
              <span className="card-title">Virtual Machines hosted on HYPERV-HOST-01</span>
              <button className="btn btn-ghost btn-sm" onClick={() => showStatus('Refreshed VM inventory')}>
                <RefreshCw size={13} />
                <span>Refresh Hyper-V</span>
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>VM Name</th>
                  <th>CPU Usage</th>
                  <th>RAM Assigned</th>
                  <th>Uptime</th>
                  <th>Gen</th>
                  <th style={{ textAlign: 'right' }}>Power Controls</th>
                </tr>
              </thead>
              <tbody>
                {vms.map((vm) => (
                  <tr key={vm.vmId}>
                    <td>
                      <span className={`status-badge ${vm.state === 'Running' ? 'online' : 'offline'}`}>
                        <span className={`status-dot ${vm.state === 'Running' ? 'online' : 'offline'}`} />
                        {vm.state}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{vm.name}</td>
                    <td>{vm.cpuUsagePercent}%</td>
                    <td>{(vm.memoryAssignedMb / 1024).toFixed(1)} GB</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{vm.uptime}</td>
                    <td>Gen {vm.generation}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className={`btn btn-sm ${vm.state === 'Running' ? 'btn-danger' : 'btn-success'}`}
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          onClick={() => handleToggleVm(vm.vmId, vm.state)}
                        >
                          {vm.state === 'Running' ? 'Stop' : 'Start'}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          onClick={() => showStatus(`Created Hyper-V Production Checkpoint for ${vm.name}`)}
                        >
                          Snapshot
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROLE 3: SQL SERVER MANAGEMENT */}
      {activeRole === 'sql' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Instance: MSSQLSERVER (Node 01)</span>
              <span className="status-badge online">Healthy</span>
            </div>
            <table className="data-table" style={{ fontSize: 12.5 }}>
              <tbody>
                <tr>
                  <td style={{ color: 'var(--text-muted)', width: 160 }}>Product Edition</td>
                  <td>Microsoft SQL Server 2022 Enterprise (CU14)</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--text-muted)' }}>Active Connections</td>
                  <td style={{ fontWeight: 600 }}>248 Sessions (Pool: 850 Max)</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--text-muted)' }}>Buffer Cache Hit Ratio</td>
                  <td style={{ color: 'var(--accent-green)', fontWeight: 700 }}>99.8%</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--text-muted)' }}>Page Life Expectancy</td>
                  <td>1,840 Seconds</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--text-muted)' }}>AlwaysOn Availability</td>
                  <td style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Synchronized (AG-PRIMARY)</td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => showStatus('Triggered full database backup for ContosoDB')}
              >
                Run Backup Now
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => showStatus('Flushed SQL Procedure Cache (DBCC FREEPROCCACHE)')}
              >
                Clear Plan Cache
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Online Databases</span>
            </div>
            <table className="data-table" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Database</th>
                  <th>Size</th>
                  <th>State</th>
                  <th>Last Backup</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Contoso_Production</td>
                  <td>1.4 TB</td>
                  <td><span className="status-badge online" style={{ fontSize: 11 }}>ONLINE</span></td>
                  <td>Today 02:00 UTC</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>ERP_Finance_Live</td>
                  <td>480 GB</td>
                  <td><span className="status-badge online" style={{ fontSize: 11 }}>ONLINE</span></td>
                  <td>Today 02:30 UTC</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Analytics_Warehouse</td>
                  <td>2.8 TB</td>
                  <td><span className="status-badge online" style={{ fontSize: 11 }}>ONLINE</span></td>
                  <td>Yesterday</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROLE 4: ACTIVE DIRECTORY */}
      {activeRole === 'ad' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Domain Controller: DC-PRIMARY-01 (CORP.CONTOSO.LOCAL)</span>
            <span className="status-badge online">SYSVOL Synced</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center', marginBottom: 20 }}>
            <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>DOMAIN ACCOUNTS</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>1,420</div>
            </div>
            <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>JOINED COMPUTERS</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>890</div>
            </div>
            <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>SECURITY GROUPS</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>145</div>
            </div>
            <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>REPLICATION LATENCY</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: 'var(--accent-green)' }}>&lt; 5s</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Active Directory Domain Services and DNS Server roles are running normally. Kerberos Key Distribution Center (kdc) and Netlogon services report 0 error events in the last 24 hours.
          </p>
        </div>
      )}
    </div>
  );
};
