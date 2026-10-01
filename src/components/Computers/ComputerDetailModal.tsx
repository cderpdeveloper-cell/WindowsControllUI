import React, { useState } from 'react';
import {
  X,
  Cpu,
  HardDrive,
  Activity,
  Folder,
  Sliders,
  Terminal,
  Shield,
  RefreshCw,
  Power,
  RotateCcw,
  Lock,
  LogOut,
  Layers,
  Database,
  Search,
  AlertTriangle,
  Play,
  Square,
  CheckCircle,
  Clock,
  Wifi,
  Package
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Computer, ProcessItem, ServiceItem, FileItem, DriveItem, SoftwareItem } from '../../types';
import {
  MOCK_PROCESSES,
  MOCK_SERVICES,
  MOCK_FILES,
  MOCK_DRIVES,
  MOCK_SOFTWARE
} from '../../services/dataService';
import { PowerShellTerminal } from './PowerShellTerminal';

interface ComputerDetailModalProps {
  computer: Computer | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const ComputerDetailModal: React.FC<ComputerDetailModalProps> = ({
  computer,
  onClose,
  onRefresh,
}) => {
  if (!computer) return null;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'performance' | 'processes' | 'services' | 'files' | 'storage' | 'software' | 'terminal' | 'actions'
  >('overview');

  const [processes, setProcesses] = useState<ProcessItem[]>(MOCK_PROCESSES);
  const [processSearch, setProcessSearch] = useState('');
  const [services, setServices] = useState<ServiceItem[]>(MOCK_SERVICES);
  const [serviceSearch, setServiceSearch] = useState('');
  const [currentPath, setCurrentPath] = useState('C:\\inetpub');
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);
  const [drives, setDrives] = useState<DriveItem[]>(MOCK_DRIVES);
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  // Performance telemetry mock chart data
  const perfData = [
    { time: '10:00', cpu: 22, memory: 48, disk: 15, net: 2.1 },
    { time: '10:05', cpu: 35, memory: 50, disk: 22, net: 4.5 },
    { time: '10:10', cpu: 65, memory: 52, disk: 80, net: 14.8 },
    { time: '10:15', cpu: 42, memory: 51, disk: 45, net: 6.2 },
    { time: '10:20', cpu: 28, memory: 49, disk: 20, net: 3.1 },
    { time: '10:25', cpu: computer.metrics?.cpuUsagePercent || 30, memory: computer.metrics?.memoryUsagePercent || 50, disk: 25, net: 4.0 },
  ];

  const triggerAction = (actionName: string) => {
    setActionNotification(`Triggered: ${actionName} on ${computer.computerName}`);
    setTimeout(() => setActionNotification(null), 3500);
  };

  const handleKillProcess = (pid: number, name: string) => {
    setProcesses(processes.filter((p) => p.processId !== pid));
    triggerAction(`SIGKILL Process ${name} (PID: ${pid})`);
  };

  const handleToggleService = (serviceName: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Running' ? 'Stopped' : 'Running';
    setServices(
      services.map((s) => (s.serviceName === serviceName ? { ...s, status: nextStatus } : s))
    );
    triggerAction(`${nextStatus === 'Running' ? 'Started' : 'Stopped'} Service ${serviceName}`);
  };

  const filteredProcesses = processes.filter(
    (p) =>
      p.name.toLowerCase().includes(processSearch.toLowerCase()) ||
      p.processId.toString().includes(processSearch)
  );

  const filteredServices = services.filter(
    (s) =>
      s.displayName.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.serviceName.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ width: '1050px', maxWidth: '95vw', height: '88vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              🖥️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{computer.computerName}</h2>
                <span className={`status-badge ${computer.isOnline ? 'online' : 'offline'}`}>
                  <span className={`status-dot ${computer.isOnline ? 'online' : 'offline'}`} />
                  {computer.status}
                </span>
                {computer.isDomainJoined && (
                  <span
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: 'var(--accent-blue)',
                      borderRadius: 4,
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    DOMAIN: {computer.domainName || 'CONTOSO'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                IP: <span style={{ color: 'var(--text-primary)' }}>{computer.ipAddress || '192.168.1.1'}</span> • OS: {computer.osName} • Agent v{computer.agent?.version || '1.2.0'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={onRefresh} title="Refresh data">
              <RefreshCw size={15} />
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action toast notification */}
        {actionNotification && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--accent-green)',
              color: 'var(--accent-green)',
              padding: '8px 16px',
              borderRadius: 6,
              fontSize: 13,
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CheckCircle size={16} />
            <span>{actionNotification}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="tabs" style={{ marginTop: 14 }}>
          <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            Specs & Overview
          </button>
          <button className={`tab ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>
            Live Metrics
          </button>
          <button className={`tab ${activeTab === 'processes' ? 'active' : ''}`} onClick={() => setActiveTab('processes')}>
            Processes ({processes.length})
          </button>
          <button className={`tab ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
            Services ({services.length})
          </button>
          <button className={`tab ${activeTab === 'storage' ? 'active' : ''}`} onClick={() => setActiveTab('storage')}>
            Storage & Disks
          </button>
          <button className={`tab ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>
            File Browser
          </button>
          <button className={`tab ${activeTab === 'software' ? 'active' : ''}`} onClick={() => setActiveTab('software')}>
            Software Inventory
          </button>
          <button className={`tab ${activeTab === 'terminal' ? 'active' : ''}`} onClick={() => setActiveTab('terminal')}>
            PowerShell Terminal
          </button>
          <button className={`tab ${activeTab === 'actions' ? 'active' : ''}`} onClick={() => setActiveTab('actions')}>
            Remote Power
          </button>
        </div>

        {/* Modal Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 0 }}>
                <div className="stat-card blue">
                  <div className="stat-label">CPU Cores / Threads</div>
                  <div className="stat-value blue" style={{ fontSize: 22 }}>
                    {computer.cpuCores || 8}C / {computer.cpuThreads || 16}T
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{computer.cpuName || 'Intel / AMD Processor'}</div>
                </div>

                <div className="stat-card green">
                  <div className="stat-label">Installed RAM</div>
                  <div className="stat-value green" style={{ fontSize: 22 }}>
                    {computer.totalMemoryBytes ? Math.round(computer.totalMemoryBytes / 1073741824) : 32} GB
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Usage: {computer.metrics?.memoryUsagePercent || 48}%
                  </div>
                </div>

                <div className="stat-card yellow">
                  <div className="stat-label">Uptime</div>
                  <div className="stat-value yellow" style={{ fontSize: 22 }}>
                    {computer.uptimeSeconds ? Math.floor(computer.uptimeSeconds / 86400) : 14} Days
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Boot: {computer.lastBootTime ? new Date(computer.lastBootTime).toLocaleDateString() : 'Active'}
                  </div>
                </div>

                <div className="stat-card red">
                  <div className="stat-label">Storage Volume (C:)</div>
                  <div className="stat-value red" style={{ fontSize: 22 }}>
                    {computer.metrics?.diskUsagePercent || 44}%
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Free: {computer.metrics ? Math.round(computer.metrics.diskFreeBytes / 1073741824) : 340} GB
                  </div>
                </div>
              </div>

              {/* Hardware & OS Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Operating System & Identity</span>
                  </div>
                  <table className="data-table" style={{ fontSize: 12.5 }}>
                    <tbody>
                      <tr>
                        <td style={{ color: 'var(--text-muted)', width: 140 }}>OS Edition</td>
                        <td style={{ fontWeight: 600 }}>{computer.osName}</td>
                      </tr>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}>Build & Version</td>
                        <td>{computer.osVersion} (Build {computer.osBuild})</td>
                      </tr>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}>Architecture</td>
                        <td>{computer.architecture || '64-bit Operating System, x64-based processor'}</td>
                      </tr>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}>Computer Name</td>
                        <td style={{ fontFamily: 'monospace' }}>{computer.computerName}</td>
                      </tr>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}>Domain Name</td>
                        <td>{computer.domainName || 'WORKGROUP'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Motherboard & Firmware</span>
                  </div>
                  <table className="data-table" style={{ fontSize: 12.5 }}>
                    <tbody>
                      <tr>
                        <td style={{ color: 'var(--text-muted)', width: 140 }}>Motherboard</td>
                        <td>{computer.motherboard || 'OEM Server Mainboard'}</td>
                      </tr>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}>BIOS / UEFI</td>
                        <td>{computer.biosVersion || 'UEFI 2.4'}</td>
                      </tr>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}>Serial Number</td>
                        <td style={{ fontFamily: 'monospace' }}>{computer.serialNumber || 'SN-CONTOSO-9921'}</td>
                      </tr>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}>Graphics Adapter</td>
                        <td>{computer.gpuName || 'Standard Display Driver'}</td>
                      </tr>
                      <tr>
                        <td style={{ color: 'var(--text-muted)' }}>Agent Status</td>
                        <td>
                          <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                            v{computer.agent?.version || '1.2.0'} Connected via WSS
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE METRICS */}
          {activeTab === 'performance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">CPU Utilization History (%)</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)' }}>
                      {computer.metrics?.cpuUsagePercent || 24.5}%
                    </span>
                  </div>
                  <div style={{ height: 200, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={perfData}>
                        <defs>
                          <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#64748b" />
                        <YAxis stroke="#64748b" domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: '#1a1d2b', borderColor: '#2a2d3e', color: '#fff' }} />
                        <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#cpuGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Memory Allocation (%)</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-green)' }}>
                      {computer.metrics?.memoryUsagePercent || 48.2}%
                    </span>
                  </div>
                  <div style={{ height: 200, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={perfData}>
                        <defs>
                          <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#64748b" />
                        <YAxis stroke="#64748b" domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: '#1a1d2b', borderColor: '#2a2d3e', color: '#fff' }} />
                        <Area type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#memGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">Telemetry Counters</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center' }}>
                  <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>RUNNING PROCESSES</div>
                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{computer.metrics?.processCount || 142}</div>
                  </div>
                  <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>THREAD COUNT</div>
                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{computer.metrics?.threadCount || 1890}</div>
                  </div>
                  <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>SYSTEM HANDLES</div>
                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{computer.metrics?.handleCount || 65400}</div>
                  </div>
                  <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>NETWORK BANDWIDTH</div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: 'var(--accent-cyan)' }}>
                      ↑ {computer.metrics ? Math.round(computer.metrics.networkSentKbps / 1024) : 1.4} MB/s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROCESS MANAGER */}
          {activeTab === 'processes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="topbar-search" style={{ minWidth: 260 }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Filter processes by name or PID..."
                    value={processSearch}
                    onChange={(e) => setProcessSearch(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => triggerAction('Refreshed process tree')}
                >
                  <RefreshCw size={13} />
                  <span>Refresh Processes</span>
                </button>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>PID</th>
                      <th>Process Name</th>
                      <th>User</th>
                      <th>CPU %</th>
                      <th>RAM (MB)</th>
                      <th>Threads</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProcesses.map((proc) => (
                      <tr key={proc.processId}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{proc.processId}</td>
                        <td style={{ fontWeight: 600 }}>
                          {proc.name}
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            {proc.path}
                          </div>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{proc.username}</td>
                        <td>
                          <span style={{ fontWeight: 600, color: proc.cpuPercent > 10 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                            {proc.cpuPercent}%
                          </span>
                        </td>
                        <td>{proc.memoryWorkingSetMb.toFixed(1)} MB</td>
                        <td>{proc.threadCount}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={() => handleKillProcess(proc.processId, proc.name)}
                          >
                            End Process
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WINDOWS SERVICES */}
          {activeTab === 'services' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="topbar-search" style={{ minWidth: 260 }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Filter services by name or display name..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => triggerAction('Refreshed services list')}
                >
                  <RefreshCw size={13} />
                  <span>Refresh Services</span>
                </button>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Service Name</th>
                      <th>Display Name</th>
                      <th>Startup Type</th>
                      <th style={{ textAlign: 'right' }}>Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((svc) => (
                      <tr key={svc.serviceName}>
                        <td>
                          <span className={`status-badge ${svc.status === 'Running' ? 'online' : 'offline'}`}>
                            <span className={`status-dot ${svc.status === 'Running' ? 'online' : 'offline'}`} />
                            {svc.status}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{svc.serviceName}</td>
                        <td>
                          <div style={{ fontWeight: 550 }}>{svc.displayName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{svc.description}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{svc.startType}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              className={`btn btn-sm ${svc.status === 'Running' ? 'btn-danger' : 'btn-success'}`}
                              style={{ padding: '3px 8px', fontSize: 11 }}
                              onClick={() => handleToggleService(svc.serviceName, svc.status)}
                            >
                              {svc.status === 'Running' ? 'Stop' : 'Start'}
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '3px 8px', fontSize: 11 }}
                              onClick={() => triggerAction(`Restarted service ${svc.serviceName}`)}
                            >
                              Restart
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

          {/* TAB 5: STORAGE & DISKS */}
          {activeTab === 'storage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {drives.map((drive) => {
                const used = drive.totalSizeBytes - drive.freeSizeBytes;
                const usedPercent = Math.round((used / drive.totalSizeBytes) * 100);
                const totalGb = Math.round(drive.totalSizeBytes / 1073741824);
                const freeGb = Math.round(drive.freeSizeBytes / 1073741824);

                return (
                  <div key={drive.name} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <HardDrive size={24} color="var(--accent-blue)" />
                        <div>
                          <span style={{ fontSize: 16, fontWeight: 700 }}>
                            {drive.name} ({drive.volumeLabel})
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>
                            {drive.driveType} • File System: {drive.fileSystem}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {freeGb} GB Free of {totalGb} GB ({usedPercent}% used)
                      </div>
                    </div>

                    <div className="progress-bar" style={{ height: 10 }}>
                      <div
                        className={`progress-fill ${usedPercent > 85 ? 'red' : usedPercent > 70 ? 'yellow' : 'blue'}`}
                        style={{ width: `${usedPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 6: FILE BROWSER */}
          {activeTab === 'files' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', padding: '8px 14px', borderRadius: 8 }}>
                <Folder size={16} color="var(--accent-yellow)" />
                <span style={{ fontSize: 13, fontFamily: 'monospace', flex: 1 }}>{currentPath}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCurrentPath('C:\\')}
                  style={{ padding: '2px 8px', fontSize: 11 }}
                >
                  Root C:\
                </button>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Last Modified</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.path}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {file.isDirectory ? (
                            <Folder size={16} color="var(--accent-yellow)" />
                          ) : (
                            <HardDrive size={16} color="var(--accent-blue)" />
                          )}
                          <span
                            style={{
                              fontWeight: file.isDirectory ? 600 : 400,
                              cursor: file.isDirectory ? 'pointer' : 'default',
                              color: file.isDirectory ? 'var(--accent-blue)' : 'inherit',
                            }}
                            onClick={() => file.isDirectory && setCurrentPath(file.path)}
                          >
                            {file.name}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {file.isDirectory ? '<DIR>' : `${(file.sizeBytes / 1024).toFixed(1)} KB`}
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {new Date(file.modifiedAt).toLocaleString()}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '2px 8px', fontSize: 11 }}
                            onClick={() => triggerAction(`Inspected file properties: ${file.name}`)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: SOFTWARE INVENTORY */}
          {activeTab === 'software' && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Software Title</th>
                    <th>Publisher</th>
                    <th>Version</th>
                    <th>Installed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SOFTWARE.map((sw) => (
                    <tr key={sw.name}>
                      <td style={{ fontWeight: 600 }}>{sw.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{sw.publisher}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{sw.version}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{sw.installDate || 'Pre-installed'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 8: POWERSHELL TERMINAL */}
          {activeTab === 'terminal' && <PowerShellTerminal computer={computer} />}

          {/* TAB 9: REMOTE POWER & ACTIONS */}
          {activeTab === 'actions' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">System Power Operations</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button
                    className="btn btn-danger"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => triggerAction('Dispatched immediate REBOOT command')}
                  >
                    <RotateCcw size={16} />
                    <span>Reboot Computer (shutdown /r /t 0)</span>
                  </button>

                  <button
                    className="btn btn-danger"
                    style={{ justifyContent: 'flex-start', background: '#991b1b' }}
                    onClick={() => triggerAction('Dispatched SHUTDOWN power-off command')}
                  >
                    <Power size={16} />
                    <span>Shutdown Computer (shutdown /s /t 0)</span>
                  </button>

                  <button
                    className="btn btn-ghost"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => triggerAction('Locked Windows Workstation (rundll32 user32.dll,LockWorkStation)')}
                  >
                    <Lock size={16} />
                    <span>Lock Workstation</span>
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">Agent & Maintenance Controls</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button
                    className="btn btn-primary"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => triggerAction('Restarted Windows Control Center Agent Windows Service')}
                  >
                    <RefreshCw size={16} />
                    <span>Restart Management Agent Service</span>
                  </button>

                  <button
                    className="btn btn-ghost"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => triggerAction('Flushed DNS and renewed DHCP lease')}
                  >
                    <Wifi size={16} />
                    <span>Flush DNS & Renew DHCP Lease</span>
                  </button>

                  <button
                    className="btn btn-ghost"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => triggerAction('Triggered Windows Update check (usoclient StartScan)')}
                  >
                    <Sliders size={16} />
                    <span>Scan for Windows Updates</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
