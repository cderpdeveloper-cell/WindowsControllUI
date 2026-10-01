import { Computer, Alert, AlertRule, EnrollmentCode, AuditLog, DashboardStats, ProcessItem, ServiceItem, FileItem, DriveItem, SoftwareItem, HyperVVM, IISSite } from '../types';
import { computersApi, alertsApi, agentsApi, auditApi } from '../api';

// Initial mock computers representing PCs, Laptops, Windows Servers, and VMs
export const MOCK_COMPUTERS: Computer[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    organizationId: 'org-1',
    computerName: 'DC-PRIMARY-01',
    domainName: 'CORP.CONTOSO.LOCAL',
    isDomainJoined: true,
    ipAddress: '192.168.10.5',
    macAddress: '00:15:5D:01:A2:3B',
    publicIpAddress: '203.0.113.10',
    osName: 'Windows Server 2025 Datacenter',
    osVersion: '10.0.26100',
    osBuild: '26100.1742',
    osEdition: 'Datacenter',
    architecture: 'x64',
    uptimeSeconds: 1420500,
    lastBootTime: '2026-09-15T08:30:00Z',
    cpuName: 'AMD EPYC 7763 64-Core Processor',
    cpuCores: 16,
    cpuThreads: 32,
    totalMemoryBytes: 68719476736, // 64 GB
    gpuName: 'Microsoft Basic Display Adapter',
    motherboard: 'Supermicro H12SSL-i',
    biosVersion: 'SM-2.4a (UEFI)',
    serialNumber: 'SMC-VMW-99281',
    status: 'Online',
    isOnline: true,
    lastHeartbeatAt: new Date().toISOString(),
    createdAt: '2026-08-01T10:00:00Z',
    agent: {
      agentId: 'a1111111-1111-1111-1111-111111111111',
      version: '1.2.0',
      status: 'Connected',
      connectedAt: '2026-09-15T08:31:00Z',
    },
    metrics: {
      computerId: 'c1111111-1111-1111-1111-111111111111',
      timestamp: new Date().toISOString(),
      cpuUsagePercent: 24.5,
      memoryUsagePercent: 48.2,
      memoryUsedBytes: 33122187776,
      memoryTotalBytes: 68719476736,
      diskUsagePercent: 38.0,
      diskFreeBytes: 340578680832,
      diskTotalBytes: 549755813888,
      networkSentKbps: 1450,
      networkReceivedKbps: 3210,
      processCount: 142,
      threadCount: 1890,
      handleCount: 65400,
    },
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    organizationId: 'org-1',
    computerName: 'APP-PROD-IIS02',
    domainName: 'CORP.CONTOSO.LOCAL',
    isDomainJoined: true,
    ipAddress: '192.168.10.12',
    macAddress: '00:15:5D:8B:11:4F',
    publicIpAddress: '203.0.113.11',
    osName: 'Windows Server 2022 Datacenter',
    osVersion: '10.0.20348',
    osBuild: '20348.2405',
    osEdition: 'Datacenter',
    architecture: 'x64',
    uptimeSeconds: 684200,
    lastBootTime: '2026-09-23T14:15:00Z',
    cpuName: 'Intel(R) Xeon(R) Gold 6338 CPU @ 2.00GHz',
    cpuCores: 8,
    cpuThreads: 16,
    totalMemoryBytes: 34359738368, // 32 GB
    gpuName: 'None',
    motherboard: 'Dell PowerEdge R750',
    biosVersion: 'Dell 1.10.2',
    serialNumber: 'DL-7X29881',
    status: 'Online',
    isOnline: true,
    lastHeartbeatAt: new Date().toISOString(),
    createdAt: '2026-08-05T12:00:00Z',
    agent: {
      agentId: 'a2222222-2222-2222-2222-222222222222',
      version: '1.2.0',
      status: 'Connected',
      connectedAt: '2026-09-23T14:16:00Z',
    },
    metrics: {
      computerId: 'c2222222-2222-2222-2222-222222222222',
      timestamp: new Date().toISOString(),
      cpuUsagePercent: 68.7,
      memoryUsagePercent: 78.4,
      memoryUsedBytes: 26938034880,
      memoryTotalBytes: 34359738368,
      diskUsagePercent: 72.5,
      diskFreeBytes: 151042785280,
      diskTotalBytes: 549755813888,
      networkSentKbps: 9420,
      networkReceivedKbps: 18450,
      processCount: 168,
      threadCount: 2240,
      handleCount: 84300,
    },
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    organizationId: 'org-1',
    computerName: 'DEV-WORKSTATION-X1',
    domainName: 'CORP.CONTOSO.LOCAL',
    isDomainJoined: true,
    ipAddress: '192.168.20.45',
    macAddress: 'B4:2E:99:A1:FE:80',
    publicIpAddress: '203.0.113.88',
    osName: 'Windows 11 Pro Enterprise',
    osVersion: '10.0.26100',
    osBuild: '26100.1882',
    osEdition: 'Enterprise',
    architecture: 'x64',
    uptimeSeconds: 84200,
    lastBootTime: '2026-09-30T09:00:00Z',
    cpuName: 'Intel Core i9-14900K 24-Core Processor',
    cpuCores: 24,
    cpuThreads: 32,
    totalMemoryBytes: 68719476736, // 64 GB
    gpuName: 'NVIDIA GeForce RTX 4090 (24 GB VRAM)',
    motherboard: 'ASUS ROG MAXIMUS Z790 HERO',
    biosVersion: '2402 (UEFI)',
    serialNumber: 'ASUS-MB-00912',
    status: 'Online',
    isOnline: true,
    lastHeartbeatAt: new Date().toISOString(),
    createdAt: '2026-08-10T14:30:00Z',
    agent: {
      agentId: 'a3333333-3333-3333-3333-333333333333',
      version: '1.2.0',
      status: 'Connected',
      connectedAt: '2026-09-30T09:01:00Z',
    },
    metrics: {
      computerId: 'c3333333-3333-3333-3333-333333333333',
      timestamp: new Date().toISOString(),
      cpuUsagePercent: 12.3,
      memoryUsagePercent: 34.6,
      memoryUsedBytes: 23776938950,
      memoryTotalBytes: 68719476736,
      diskUsagePercent: 44.1,
      diskFreeBytes: 1120000000000,
      diskTotalBytes: 2000000000000,
      networkSentKbps: 420,
      networkReceivedKbps: 890,
      processCount: 230,
      threadCount: 3100,
      handleCount: 110400,
    },
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    organizationId: 'org-1',
    computerName: 'SQL-CLUSTER-NODE01',
    domainName: 'CORP.CONTOSO.LOCAL',
    isDomainJoined: true,
    ipAddress: '192.168.10.20',
    macAddress: '00:15:5D:44:99:A1',
    publicIpAddress: '203.0.113.15',
    osName: 'Windows Server 2025 Standard',
    osVersion: '10.0.26100',
    osBuild: '26100.1742',
    osEdition: 'Standard',
    architecture: 'x64',
    uptimeSeconds: 1980000,
    lastBootTime: '2026-09-08T03:00:00Z',
    cpuName: 'Intel(R) Xeon(R) Platinum 8480+ Processor',
    cpuCores: 32,
    cpuThreads: 64,
    totalMemoryBytes: 137438953472, // 128 GB
    gpuName: 'None',
    motherboard: 'HPE ProLiant DL380 Gen11',
    biosVersion: 'HPE U54 v2.10',
    serialNumber: 'HP-CZ284910',
    status: 'Warning',
    isOnline: true,
    lastHeartbeatAt: new Date().toISOString(),
    createdAt: '2026-08-02T11:00:00Z',
    agent: {
      agentId: 'a4444444-4444-4444-4444-444444444444',
      version: '1.2.0',
      status: 'Connected',
      connectedAt: '2026-09-08T03:02:00Z',
    },
    metrics: {
      computerId: 'c4444444-4444-4444-4444-444444444444',
      timestamp: new Date().toISOString(),
      cpuUsagePercent: 89.2,
      memoryUsagePercent: 91.5,
      memoryUsedBytes: 125756642426,
      memoryTotalBytes: 137438953472,
      diskUsagePercent: 88.4,
      diskFreeBytes: 254820000000,
      diskTotalBytes: 2200000000000,
      networkSentKbps: 34100,
      networkReceivedKbps: 41200,
      processCount: 198,
      threadCount: 4200,
      handleCount: 142000,
    },
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    organizationId: 'org-1',
    computerName: 'HYPERV-HOST-01',
    domainName: 'CORP.CONTOSO.LOCAL',
    isDomainJoined: true,
    ipAddress: '192.168.10.2',
    macAddress: '70:B5:E8:4A:9C:12',
    publicIpAddress: '203.0.113.2',
    osName: 'Windows Server 2025 Datacenter Azure Edition',
    osVersion: '10.0.26100',
    osBuild: '26100.1742',
    osEdition: 'Datacenter',
    architecture: 'x64',
    uptimeSeconds: 3120000,
    lastBootTime: '2026-08-25T00:00:00Z',
    cpuName: 'Dual AMD EPYC 9654 96-Core Processors (192 Cores total)',
    cpuCores: 192,
    cpuThreads: 384,
    totalMemoryBytes: 274877906944, // 256 GB
    gpuName: 'None',
    motherboard: 'Supermicro H13DSH',
    biosVersion: 'SM-3.1',
    serialNumber: 'SMC-H13-88910',
    status: 'Online',
    isOnline: true,
    lastHeartbeatAt: new Date().toISOString(),
    createdAt: '2026-07-20T08:00:00Z',
    agent: {
      agentId: 'a5555555-5555-5555-5555-555555555555',
      version: '1.2.0',
      status: 'Connected',
      connectedAt: '2026-08-25T00:02:00Z',
    },
    metrics: {
      computerId: 'c5555555-5555-5555-5555-555555555555',
      timestamp: new Date().toISOString(),
      cpuUsagePercent: 32.1,
      memoryUsagePercent: 62.4,
      memoryUsedBytes: 171523813933,
      memoryTotalBytes: 274877906944,
      diskUsagePercent: 51.2,
      diskFreeBytes: 3900000000000,
      diskTotalBytes: 8000000000000,
      networkSentKbps: 65200,
      networkReceivedKbps: 78100,
      processCount: 312,
      threadCount: 6800,
      handleCount: 198000,
    },
  },
  {
    id: 'c6666666-6666-6666-6666-666666666666',
    organizationId: 'org-1',
    computerName: 'BRANCH-OFFICE-PC09',
    domainName: 'CORP.CONTOSO.LOCAL',
    isDomainJoined: true,
    ipAddress: '10.50.4.19',
    macAddress: 'E8:84:A5:11:02:BB',
    publicIpAddress: '198.51.100.42',
    osName: 'Windows 11 Pro',
    osVersion: '10.0.22631',
    osBuild: '22631.3880',
    osEdition: 'Pro',
    architecture: 'x64',
    uptimeSeconds: 0,
    lastBootTime: '2026-09-28T18:00:00Z',
    cpuName: 'Intel Core i5-12400 Processor',
    cpuCores: 6,
    cpuThreads: 12,
    totalMemoryBytes: 17179869184, // 16 GB
    gpuName: 'Intel UHD Graphics 730',
    motherboard: 'Lenovo ThinkCentre M70s',
    biosVersion: 'M3HKT34A',
    serialNumber: 'LNV-MJ09A982',
    status: 'Offline',
    isOnline: false,
    lastHeartbeatAt: '2026-09-30T17:45:00Z',
    createdAt: '2026-08-15T09:00:00Z',
    agent: {
      agentId: 'a6666666-6666-6666-6666-666666666666',
      version: '1.2.0',
      status: 'Disconnected',
    },
    metrics: {
      computerId: 'c6666666-6666-6666-6666-666666666666',
      timestamp: '2026-09-30T17:45:00Z',
      cpuUsagePercent: 0,
      memoryUsagePercent: 0,
      memoryUsedBytes: 0,
      memoryTotalBytes: 17179869184,
      diskUsagePercent: 32.0,
      diskFreeBytes: 340000000000,
      diskTotalBytes: 500000000000,
      networkSentKbps: 0,
      networkReceivedKbps: 0,
      processCount: 0,
      threadCount: 0,
      handleCount: 0,
    },
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alt-1',
    computerId: 'c4444444-4444-4444-4444-444444444444',
    computerName: 'SQL-CLUSTER-NODE01',
    title: 'High Memory Threshold Exceeded',
    message: 'Memory utilization has stayed above 90% for > 15 minutes (current: 91.5%).',
    severity: 'Critical',
    status: 'Active',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'alt-2',
    computerId: 'c4444444-4444-4444-4444-444444444444',
    computerName: 'SQL-CLUSTER-NODE01',
    title: 'CPU Spike Warning',
    message: 'CPU usage exceeded 85% sustained threshold on node.',
    severity: 'Warning',
    status: 'Active',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'alt-3',
    computerId: 'c6666666-6666-6666-6666-666666666666',
    computerName: 'BRANCH-OFFICE-PC09',
    title: 'Endpoint Offline Warning',
    message: 'No heartbeat received from agent for over 12 hours.',
    severity: 'Warning',
    status: 'Active',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'alt-4',
    computerId: 'c2222222-2222-2222-2222-222222222222',
    computerName: 'APP-PROD-IIS02',
    title: 'W3WP Process High Thread Count',
    message: 'IIS Application Pool AppPool-Main reached 450 worker threads.',
    severity: 'Info',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
  },
];

export const MOCK_ALERT_RULES: AlertRule[] = [
  { id: 'rule-1', name: 'Critical CPU Threshold', metricType: 'CpuUsagePercent', condition: 'GreaterThan', threshold: 90, severity: 'Critical', isEnabled: true },
  { id: 'rule-2', name: 'High Memory Alert', metricType: 'MemoryUsagePercent', condition: 'GreaterThan', threshold: 90, severity: 'Critical', isEnabled: true },
  { id: 'rule-3', name: 'Low Disk Space Warning', metricType: 'DiskFreePercent', condition: 'LessThan', threshold: 10, severity: 'Warning', isEnabled: true },
  { id: 'rule-4', name: 'Agent Heartbeat Timeout', metricType: 'HeartbeatAgeSeconds', condition: 'GreaterThan', threshold: 120, severity: 'Warning', isEnabled: true },
];

export const MOCK_ENROLLMENT_CODES: EnrollmentCode[] = [
  {
    id: 'enc-1',
    code: 'WCC-CORP-9882-XQ',
    description: 'Production Domain Controllers & Windows Servers Enrollment',
    expiresAt: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    maxUses: 100,
    usedCount: 5,
    status: 'Active',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'enc-2',
    code: 'WCC-DEV-3310-AZ',
    description: 'Workstations and Developer Laptops Provisioning',
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    maxUses: 50,
    usedCount: 12,
    status: 'Active',
    createdAt: '2026-09-01T12:00:00Z',
  },
];

export const MOCK_PROCESSES: ProcessItem[] = [
  { processId: 4, name: 'System', cpuPercent: 0.8, memoryWorkingSetMb: 12.4, threadCount: 248, path: 'ntoskrnl.exe', username: 'SYSTEM' },
  { processId: 980, name: 'sqlservr.exe', cpuPercent: 34.2, memoryWorkingSetMb: 18450.2, threadCount: 420, path: 'C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Binn\\sqlservr.exe', username: 'NT SERVICE\\MSSQLSERVER' },
  { processId: 1420, name: 'w3wp.exe', cpuPercent: 18.5, memoryWorkingSetMb: 2420.8, threadCount: 160, path: 'C:\\Windows\\System32\\inetsrv\\w3wp.exe', username: 'IIS APPPOOL\\DefaultAppPool' },
  { processId: 2154, name: 'WindowsControlCenter.Agent.exe', cpuPercent: 0.2, memoryWorkingSetMb: 42.6, threadCount: 18, path: 'C:\\Program Files\\Windows Control Center\\Agent\\WindowsControlCenter.Agent.exe', username: 'NT AUTHORITY\\SYSTEM' },
  { processId: 3012, name: 'vmms.exe', cpuPercent: 2.1, memoryWorkingSetMb: 890.0, threadCount: 88, path: 'C:\\Windows\\System32\\vmms.exe', username: 'NT AUTHORITY\\SYSTEM' },
  { processId: 4208, name: 'explorer.exe', cpuPercent: 1.1, memoryWorkingSetMb: 184.2, threadCount: 72, path: 'C:\\Windows\\explorer.exe', username: 'CONTOSO\\Administrator' },
  { processId: 5890, name: 'powershell.exe', cpuPercent: 0.0, memoryWorkingSetMb: 94.5, threadCount: 14, path: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', username: 'CONTOSO\\Administrator' },
  { processId: 6712, name: 'svchost.exe (Dns)', cpuPercent: 0.1, memoryWorkingSetMb: 54.0, threadCount: 32, path: 'C:\\Windows\\System32\\svchost.exe', username: 'NT AUTHORITY\\NETWORK SERVICE' },
  { processId: 7894, name: 'MsMpEng.exe', cpuPercent: 1.4, memoryWorkingSetMb: 260.4, threadCount: 44, path: 'C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\MsMpEng.exe', username: 'NT AUTHORITY\\SYSTEM' },
  { processId: 8120, name: 'lsass.exe', cpuPercent: 0.6, memoryWorkingSetMb: 88.2, threadCount: 56, path: 'C:\\Windows\\System32\\lsass.exe', username: 'NT AUTHORITY\\SYSTEM' },
];

export const MOCK_SERVICES: ServiceItem[] = [
  { serviceName: 'W3SVC', displayName: 'World Wide Web Publishing Service', status: 'Running', startType: 'Automatic', description: 'Provides Web connectivity and administration through IIS.' },
  { serviceName: 'MSSQLSERVER', displayName: 'SQL Server (MSSQLSERVER)', status: 'Running', startType: 'Automatic', description: 'Provides storage, processing and controlled access of data and rapid transaction processing.' },
  { serviceName: 'vmms', displayName: 'Hyper-V Virtual Machine Management', status: 'Running', startType: 'Automatic', description: 'Manages the virtual machines on the Hyper-V host.' },
  { serviceName: 'WindowsControlCenterAgent', displayName: 'Windows Control Center Management Agent', status: 'Running', startType: 'Automatic', description: 'Communicates with the central Control Center server for metrics and administrative tasks.' },
  { serviceName: 'Dnscache', displayName: 'DNS Client', status: 'Running', startType: 'Automatic', description: 'The DNS Client service (dnscache) caches Domain Name System names and registers the full computer name.' },
  { serviceName: 'TermService', displayName: 'Remote Desktop Services', status: 'Running', startType: 'Manual', description: 'Allows users to connect interactively to a remote computer.' },
  { serviceName: 'LanmanServer', displayName: 'Server', status: 'Running', startType: 'Automatic', description: 'Supports file, print, and named-pipe sharing over the network for this computer.' },
  { serviceName: 'wuauserv', displayName: 'Windows Update', status: 'Running', startType: 'Manual', description: 'Enables the detection, download, and installation of updates for Windows and other programs.' },
  { serviceName: 'Spooler', displayName: 'Print Spooler', status: 'Stopped', startType: 'Manual', description: 'Spools print jobs and handles interaction with the printer.' },
  { serviceName: 'EventLog', displayName: 'Windows Event Log', status: 'Running', startType: 'Automatic', description: 'This service manages events and event logs.' },
];

export const MOCK_DRIVES: DriveItem[] = [
  { name: 'C:\\', volumeLabel: 'OS_Disk', driveType: 'Fixed (NVMe SSD)', totalSizeBytes: 549755813888, freeSizeBytes: 340578680832, fileSystem: 'NTFS' },
  { name: 'D:\\', volumeLabel: 'DATA_Volume', driveType: 'Fixed (RAID-10 SSD)', totalSizeBytes: 2199023255552, freeSizeBytes: 1428023255552, fileSystem: 'ReFS' },
  { name: 'E:\\', volumeLabel: 'BACKUPS_SAN', driveType: 'Network / iSCSI LUN', totalSizeBytes: 8796093022208, freeSizeBytes: 4296093022208, fileSystem: 'NTFS' },
];

export const MOCK_FILES: FileItem[] = [
  { name: 'inetpub', path: 'C:\\inetpub', isDirectory: true, sizeBytes: 0, modifiedAt: '2026-09-18T10:20:00Z' },
  { name: 'Program Files', path: 'C:\\Program Files', isDirectory: true, sizeBytes: 0, modifiedAt: '2026-09-24T12:00:00Z' },
  { name: 'Program Files (x86)', path: 'C:\\Program Files (x86)', isDirectory: true, sizeBytes: 0, modifiedAt: '2026-09-24T12:00:00Z' },
  { name: 'Windows', path: 'C:\\Windows', isDirectory: true, sizeBytes: 0, modifiedAt: '2026-09-30T04:15:00Z' },
  { name: 'SQLData', path: 'C:\\SQLData', isDirectory: true, sizeBytes: 0, modifiedAt: '2026-09-29T18:30:00Z' },
  { name: 'Web.config', path: 'C:\\inetpub\\wwwroot\\Web.config', isDirectory: false, sizeBytes: 4210, modifiedAt: '2026-09-12T14:22:00Z', extension: 'config' },
  { name: 'bootmgr', path: 'C:\\bootmgr', isDirectory: false, sizeBytes: 411894, modifiedAt: '2026-05-10T02:10:00Z' },
  { name: 'backup_20261001.bak', path: 'C:\\SQLData\\backup_20261001.bak', isDirectory: false, sizeBytes: 1548200192, modifiedAt: '2026-10-01T02:00:00Z', extension: 'bak' },
];

export const MOCK_SOFTWARE: SoftwareItem[] = [
  { name: 'Microsoft SQL Server 2022 (64-bit)', version: '16.0.4125.3', publisher: 'Microsoft Corporation', installDate: '2026-08-02' },
  { name: 'IIS 10.0 Express & Management Tools', version: '10.0.26100', publisher: 'Microsoft Corporation', installDate: '2026-08-01' },
  { name: '.NET 10.0.0 Runtime & Hosting Bundle', version: '10.0.0-rt', publisher: 'Microsoft Corporation', installDate: '2026-09-10' },
  { name: 'Google Chrome Enterprise', version: '129.0.6668.70', publisher: 'Google LLC', installDate: '2026-09-15' },
  { name: '7-Zip 24.08 (x64)', version: '24.08', publisher: 'Igor Pavlov', installDate: '2026-08-01' },
  { name: 'Windows Control Center Agent', version: '1.2.0', publisher: 'Contoso Systems', installDate: '2026-08-01' },
  { name: 'Wireshark 4.2.5', version: '4.2.5', publisher: 'The Wireshark Team', installDate: '2026-08-20' },
];

export const MOCK_HYPERV_VMS: HyperVVM[] = [
  { vmId: 'vm-1', name: 'VM-CORE-ROUTER', state: 'Running', cpuUsagePercent: 8.2, memoryAssignedMb: 4096, uptime: '36 days, 4 hours', generation: 2 },
  { vmId: 'vm-2', name: 'VM-SQL-SECONDARY', state: 'Running', cpuUsagePercent: 44.5, memoryAssignedMb: 32768, uptime: '14 days, 12 hours', generation: 2 },
  { vmId: 'vm-3', name: 'VM-UBUNTU-NGINX-DMZ', state: 'Running', cpuUsagePercent: 12.0, memoryAssignedMb: 8192, uptime: '22 days, 1 hour', generation: 2 },
  { vmId: 'vm-4', name: 'VM-TEST-STAGING', state: 'Off', cpuUsagePercent: 0, memoryAssignedMb: 16384, uptime: '0', generation: 2 },
];

export const MOCK_IIS_SITES: IISSite[] = [
  { id: 1, name: 'Default Web Site', state: 'Started', bindings: ['http/*:80:', 'https/*:443:ssl'], appPool: 'DefaultAppPool', physicalPath: 'C:\\inetpub\\wwwroot' },
  { id: 2, name: 'Portal.Contoso.Local', state: 'Started', bindings: ['https/portal.contoso.local:443:ssl'], appPool: 'AppPool-Portal', physicalPath: 'C:\\inetpub\\portal' },
  { id: 3, name: 'Internal-API-Gateway', state: 'Started', bindings: ['http/*:8080:'], appPool: 'AppPool-APIGateway', physicalPath: 'C:\\inetpub\\api' },
  { id: 4, name: 'Legacy-Reporting', state: 'Stopped', bindings: ['http/*:8088:'], appPool: 'AppPool-Reporting', physicalPath: 'C:\\inetpub\\reports' },
];

export const SCRIPT_PRESETS: { id: string; name: string; category: string; description: string; command: string }[] = [
  { id: 'p1', name: 'Flush DNS Cache', category: 'Network', description: 'Clears the local client DNS resolver cache.', command: 'Clear-DnsClientCache; ipconfig /flushdns' },
  { id: 'p2', name: 'Restart Windows Explorer', category: 'System', description: 'Kills and restarts the explorer.exe desktop shell.', command: 'Stop-Process -Name explorer -Force; Start-Process explorer' },
  { id: 'p3', name: 'List Installed Hotfixes', category: 'Diagnostics', description: 'Retrieves recently applied Windows security patches.', command: 'Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10 HotFixID, Description, InstalledOn' },
  { id: 'p4', name: 'Test Network Connectivity', category: 'Network', description: 'Runs a TCP ping to Gateway and DNS servers.', command: 'Test-NetConnection -ComputerName 1.1.1.1 -Port 53' },
  { id: 'p5', name: 'Check Disk Space', category: 'Storage', description: 'Reports free space on all fixed storage partitions.', command: 'Get-PSDrive -PSProvider FileSystem | Select-Object Name, @{n="Used(GB)";e={[math]::round($_.Used/1GB,2)}}, @{n="Free(GB)";e={[math]::round($_.Free/1GB,2)}}' },
  { id: 'p6', name: 'Check System Security Privileges', category: 'Security', description: 'Inspects user token privileges and elevation level.', command: 'whoami /priv; whoami /groups' },
  { id: 'p7', name: 'List High Memory Processes', category: 'Diagnostics', description: 'Identifies top 5 memory consuming applications.', command: 'Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 Name, Id, @{n="Memory (MB)";e={[math]::round($_.WorkingSet/1MB,1)}}' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), action: 'ExecutePowerShell', category: 'Automation', details: 'Executed "Clear-DnsClientCache" on DC-PRIMARY-01', userName: 'admin@contoso.local', ipAddress: '192.168.1.100', success: true },
  { id: 'log-2', timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), action: 'RestartService', category: 'Services', details: 'Restarted service "W3SVC" on APP-PROD-IIS02', userName: 'admin@contoso.local', ipAddress: '192.168.1.100', success: true },
  { id: 'log-3', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), action: 'GenerateEnrollmentCode', category: 'AgentSecurity', details: 'Created code WCC-CORP-9882-XQ with 14-day validity', userName: 'admin@contoso.local', ipAddress: '192.168.1.100', success: true },
  { id: 'log-4', timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), action: 'KillProcess', category: 'ProcessManagement', details: 'Terminated unresponsive process PID: 8412 (w3wp.exe)', userName: 'secops@contoso.local', ipAddress: '192.168.1.105', success: true },
  { id: 'log-5', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), action: 'UserLoginSuccess', category: 'Authentication', details: 'Admin logged in via TOTP 2FA', userName: 'admin@contoso.local', ipAddress: '192.168.1.100', success: true },
];

export function mapApiSummaryToComputer(c: any): Computer {
  const isOnline = Boolean(c.isOnline);
  let status: 'Online' | 'Offline' | 'Warning' | 'Error' = isOnline ? 'Online' : 'Offline';
  if (c.status === 3 || c.status === 'Warning') status = 'Warning';
  if (c.status === 4 || c.status === 'Critical' || c.status === 'Error') status = 'Error';

  return {
    id: c.id,
    organizationId: c.organizationId || '',
    computerName: c.computerName || 'Windows Endpoint',
    domainName: c.domain || c.domainName || 'WORKGROUP',
    isDomainJoined: Boolean(c.domain),
    ipAddress: c.ipAddress || '—',
    macAddress: c.macAddress || '—',
    publicIpAddress: c.publicIpAddress || '',
    osName: c.osName || 'Windows',
    osVersion: c.osVersion || '',
    osBuild: c.osBuild || '',
    osEdition: c.osEdition || '',
    architecture: c.osArchitecture || 'x64',
    uptimeSeconds: c.uptimeSeconds || 0,
    status,
    isOnline,
    lastHeartbeatAt: c.lastSeenAt || c.lastHeartbeatAt,
    createdAt: c.createdAt || new Date().toISOString(),
    agent: {
      agentId: c.agent?.agentId || c.id,
      version: c.agentVersion || c.agent?.version || '1.0.0',
      status: isOnline ? 'Connected' : 'Disconnected',
    },
    metrics: {
      computerId: c.id,
      timestamp: new Date().toISOString(),
      cpuUsagePercent: c.lastCpuPercent ?? c.metrics?.cpuUsagePercent ?? 0,
      memoryUsagePercent: c.lastMemoryPercent ?? c.metrics?.memoryUsagePercent ?? 0,
      memoryUsedBytes: c.metrics?.memoryUsedBytes ?? 0,
      memoryTotalBytes: c.metrics?.memoryTotalBytes ?? 16000000000,
      diskUsagePercent: c.lastDiskPercent ?? c.metrics?.diskUsagePercent ?? 0,
      diskFreeBytes: c.metrics?.diskFreeBytes ?? 0,
      diskTotalBytes: c.metrics?.diskTotalBytes ?? 500000000000,
      networkSentKbps: c.metrics?.networkSentKbps ?? 0,
      networkReceivedKbps: c.metrics?.networkReceivedKbps ?? 0,
      processCount: c.metrics?.processCount ?? 0,
      threadCount: c.metrics?.threadCount ?? 0,
      handleCount: c.metrics?.handleCount ?? 0,
    },
  };
}

export const dataService = {
  async getComputers(): Promise<Computer[]> {
    try {
      const res = await computersApi.list();
      if (res.data && Array.isArray(res.data.items)) {
        return res.data.items.map(mapApiSummaryToComputer);
      }
      if (Array.isArray(res.data)) {
        return res.data.map(mapApiSummaryToComputer);
      }
    } catch (err) {
      console.warn('Could not fetch computers from API:', err);
    }
    return [];
  },

  async getComputer(id: string): Promise<Computer | undefined> {
    try {
      const res = await computersApi.get(id);
      if (res.data) {
        return mapApiSummaryToComputer(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch computer details:', err);
    }
    return undefined;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await computersApi.dashboard();
      if (res.data) {
        const d = res.data;
        return {
          totalComputers: d.totalComputers ?? 0,
          onlineComputers: d.onlineComputers ?? 0,
          offlineComputers: d.offlineComputers ?? 0,
          warningComputers: d.warningAlerts ?? 0,
          activeAlertsCount: (d.warningAlerts ?? 0) + (d.criticalAlerts ?? 0),
          avgCpuPercent: d.avgCpu ? Math.round(d.avgCpu * 10) / 10 : 0,
          avgMemoryPercent: d.avgMemory ? Math.round(d.avgMemory * 10) / 10 : 0,
          recentAlerts: Array.isArray(d.recentAlerts)
            ? d.recentAlerts.map((a: any) => ({
                id: a.id,
                computerId: a.computerId || '',
                computerName: a.computerName || 'Endpoint',
                title: a.title || 'System Alert',
                severity: a.severity === 2 ? 'Critical' : a.severity === 1 ? 'Warning' : 'Info',
                status: a.status === 2 ? 'Resolved' : a.status === 1 ? 'Acknowledged' : 'Active',
                createdAt: a.createdAt || new Date().toISOString(),
              }))
            : [],
        };
      }
    } catch (err) {
      console.warn('Could not fetch dashboard stats:', err);
    }
    return {
      totalComputers: 0,
      onlineComputers: 0,
      offlineComputers: 0,
      warningComputers: 0,
      activeAlertsCount: 0,
      avgCpuPercent: 0,
      avgMemoryPercent: 0,
      recentAlerts: [],
    };
  },

  async getAlerts(): Promise<Alert[]> {
    try {
      const res = await alertsApi.list();
      if (res.data && Array.isArray(res.data.items)) return res.data.items;
      if (Array.isArray(res.data)) return res.data;
    } catch (err) {
      console.warn('Could not fetch alerts:', err);
    }
    return [];
  },

  async getAlertRules(): Promise<AlertRule[]> {
    try {
      const res = await alertsApi.rules();
      if (res.data && Array.isArray(res.data)) return res.data;
    } catch (err) {
      console.warn('Could not fetch alert rules:', err);
    }
    return [];
  },

  async getEnrollmentCodes(): Promise<EnrollmentCode[]> {
    try {
      const res = await agentsApi.listCodes();
      if (res.data && Array.isArray(res.data.items)) return res.data.items;
      if (Array.isArray(res.data)) return res.data;
    } catch (err) {
      console.warn('Could not fetch enrollment codes:', err);
    }
    return [];
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await auditApi.list();
      if (res.data && Array.isArray(res.data.items)) return res.data.items;
      if (Array.isArray(res.data)) return res.data;
    } catch (err) {
      console.warn('Could not fetch audit logs:', err);
    }
    return [];
  },
};
