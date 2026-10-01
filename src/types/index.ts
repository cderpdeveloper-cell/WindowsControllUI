export interface Computer {
  id: string;
  organizationId: string;
  computerName: string;
  domainName?: string;
  isDomainJoined: boolean;
  ipAddress?: string;
  macAddress?: string;
  publicIpAddress?: string;
  osName?: string;
  osVersion?: string;
  osBuild?: string;
  osEdition?: string;
  architecture?: string;
  uptimeSeconds?: number;
  lastBootTime?: string;
  cpuName?: string;
  cpuCores?: number;
  cpuThreads?: number;
  totalMemoryBytes?: number;
  gpuName?: string;
  motherboard?: string;
  biosVersion?: string;
  serialNumber?: string;
  status: 'Online' | 'Offline' | 'Warning' | 'Error';
  isOnline: boolean;
  lastHeartbeatAt?: string;
  createdAt: string;
  agent?: {
    agentId: string;
    version: string;
    status: string;
    connectedAt?: string;
  };
  metrics?: MetricsData;
}

export interface MetricsData {
  computerId: string;
  timestamp: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  memoryUsedBytes: number;
  memoryTotalBytes: number;
  diskUsagePercent: number;
  diskFreeBytes: number;
  diskTotalBytes: number;
  networkSentKbps: number;
  networkReceivedKbps: number;
  processCount: number;
  threadCount: number;
  handleCount: number;
}

export interface ProcessItem {
  processId: number;
  name: string;
  cpuPercent: number;
  memoryWorkingSetMb: number;
  threadCount: number;
  path?: string;
  username?: string;
}

export interface ServiceItem {
  serviceName: string;
  displayName: string;
  status: 'Running' | 'Stopped' | 'Paused' | string;
  startType: 'Automatic' | 'Manual' | 'Disabled' | string;
  description?: string;
}

export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  sizeBytes: number;
  modifiedAt: string;
  extension?: string;
}

export interface DriveItem {
  name: string;
  volumeLabel?: string;
  driveType?: string;
  totalSizeBytes: number;
  freeSizeBytes: number;
  fileSystem?: string;
}

export interface SoftwareItem {
  name: string;
  version: string;
  publisher: string;
  installDate?: string;
  installLocation?: string;
}

export interface Alert {
  id: string;
  computerId?: string;
  computerName?: string;
  title: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  status: 'Active' | 'Acknowledged' | 'Resolved';
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  metricType: string;
  condition: string;
  threshold: number;
  severity: 'Critical' | 'Warning' | 'Info';
  isEnabled: boolean;
}

export interface EnrollmentCode {
  id: string;
  code: string;
  description?: string;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  status: 'Active' | 'Revoked' | 'Expired';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: string;
  details: string;
  userName: string;
  ipAddress?: string;
  success: boolean;
}

export interface DashboardStats {
  totalComputers: number;
  onlineComputers: number;
  offlineComputers: number;
  warningComputers: number;
  activeAlertsCount: number;
  avgCpuPercent: number;
  avgMemoryPercent: number;
  recentAlerts: Alert[];
}

export interface HyperVVM {
  vmId: string;
  name: string;
  state: 'Running' | 'Off' | 'Saved' | 'Paused';
  cpuUsagePercent: number;
  memoryAssignedMb: number;
  uptime: string;
  generation: number;
}

export interface IISSite {
  id: number;
  name: string;
  state: 'Started' | 'Stopped' | 'Starting';
  bindings: string[];
  appPool: string;
  physicalPath: string;
}

export interface ScriptPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  command: string;
}
