import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Topbar } from './components/Layout/Topbar';
import { DashboardPage } from './pages/DashboardPage';
import { ComputersPage } from './pages/ComputersPage';
import { EnterpriseRolesPage } from './pages/EnterpriseRolesPage';
import { AutomationPage } from './pages/AutomationPage';
import { AlertsPage } from './pages/AlertsPage';
import { EnrollmentPage } from './pages/EnrollmentPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ComputerDetailModal } from './components/Computers/ComputerDetailModal';
import { EnrollmentModal } from './components/Computers/EnrollmentModal';
import { dataService, MOCK_COMPUTERS, MOCK_ALERTS, MOCK_ENROLLMENT_CODES, MOCK_AUDIT_LOGS, MOCK_ALERT_RULES } from './services/dataService';
import { signalRService } from './services/signalrService';
import { Computer, Alert, EnrollmentCode, AuditLog, AlertRule, DashboardStats } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Core Data State
  const [computers, setComputers] = useState<Computer[]>(MOCK_COMPUTERS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [rules, setRules] = useState<AlertRule[]>(MOCK_ALERT_RULES);
  const [codes, setCodes] = useState<EnrollmentCode[]>(MOCK_ENROLLMENT_CODES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [stats, setStats] = useState<DashboardStats>({
    totalComputers: MOCK_COMPUTERS.length,
    onlineComputers: MOCK_COMPUTERS.filter((c) => c.isOnline).length,
    offlineComputers: MOCK_COMPUTERS.filter((c) => !c.isOnline).length,
    warningComputers: MOCK_COMPUTERS.filter((c) => c.status === 'Warning').length,
    activeAlertsCount: MOCK_ALERTS.filter((a) => a.status === 'Active').length,
    avgCpuPercent: 45.4,
    avgMemoryPercent: 63.0,
    recentAlerts: MOCK_ALERTS,
  });

  // Active Selected Computer & Modals
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  // Initialize and connect SignalR
  useEffect(() => {
    let unsubscribeMetrics: (() => void) | undefined;

    const init = async () => {
      const connected = await signalRService.connect();
      setIsLiveConnected(connected);

      // Listen for live telemetry stream updates
      unsubscribeMetrics = signalRService.onMetrics((metrics) => {
        setComputers((prev) =>
          prev.map((c) =>
            c.id === metrics.computerId ? { ...c, metrics, isOnline: true, status: 'Online' } : c
          )
        );
      });
    };

    init();

    // Simulated heartbeat & slight telemetry fluctuations to feel alive
    const interval = setInterval(() => {
      setComputers((prev) =>
        prev.map((comp) => {
          if (!comp.isOnline || !comp.metrics) return comp;
          const jitter = (Math.random() - 0.5) * 4;
          const newCpu = Math.max(5, Math.min(98, Math.round((comp.metrics.cpuUsagePercent + jitter) * 10) / 10));
          return {
            ...comp,
            metrics: {
              ...comp.metrics,
              cpuUsagePercent: newCpu,
              networkSentKbps: Math.round(comp.metrics.networkSentKbps * (0.95 + Math.random() * 0.1)),
            },
          };
        })
      );
    }, 4000);

    return () => {
      clearInterval(interval);
      if (unsubscribeMetrics) unsubscribeMetrics();
    };
  }, []);

  const refreshAll = async () => {
    const comps = await dataService.getComputers();
    const st = await dataService.getDashboardStats();
    const al = await dataService.getAlerts();
    const cd = await dataService.getEnrollmentCodes();
    const lg = await dataService.getAuditLogs();
    setComputers(comps);
    setStats(st);
    setAlerts(al);
    setCodes(cd);
    setAuditLogs(lg);
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: 'Acknowledged' } : a)));
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a)));
  };

  const handleGenerateCode = (description: string, days: number) => {
    const newCode: EnrollmentCode = {
      id: `enc-${Date.now()}`,
      code: `WCC-GEN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      description,
      expiresAt: new Date(Date.now() + days * 24 * 3600 * 1000).toISOString(),
      maxUses: 50,
      usedCount: 0,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    setCodes([newCode, ...codes]);
  };

  const handleSelectComputerFromAnywhere = (comp: Computer) => {
    setSelectedComputer(comp);
  };

  return (
    <div className="app-layout">
      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        alertCount={alerts.filter((a) => a.status === 'Active').length}
      />

      {/* Main Content Viewport */}
      <div className="main-content">
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={refreshAll}
          isLiveConnected={isLiveConnected}
          onOpenEnrollment={() => setIsEnrollmentModalOpen(true)}
        />

        <main className="page-content">
          {currentTab === 'dashboard' && (
            <DashboardPage
              computers={computers}
              stats={stats}
              alerts={alerts}
              onSelectComputer={handleSelectComputerFromAnywhere}
              onOpenAlerts={() => setCurrentTab('alerts')}
              onOpenEnrollment={() => setIsEnrollmentModalOpen(true)}
            />
          )}

          {currentTab === 'computers' && (
            <ComputersPage
              computers={computers}
              onSelectComputer={handleSelectComputerFromAnywhere}
              onRefresh={refreshAll}
              onOpenEnrollment={() => setIsEnrollmentModalOpen(true)}
            />
          )}

          {currentTab === 'roles' && <EnterpriseRolesPage />}

          {currentTab === 'automation' && <AutomationPage computers={computers} />}

          {currentTab === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              rules={rules}
              onAcknowledge={handleAcknowledgeAlert}
              onResolve={handleResolveAlert}
              onCreateRule={() => {}}
            />
          )}

          {currentTab === 'enrollment' && (
            <EnrollmentPage
              codes={codes}
              onOpenGenerateModal={() => setIsEnrollmentModalOpen(true)}
            />
          )}

          {currentTab === 'audit' && <AuditLogsPage logs={auditLogs} />}

          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Modals */}
      <ComputerDetailModal
        computer={selectedComputer}
        onClose={() => setSelectedComputer(null)}
        onRefresh={refreshAll}
      />

      <EnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
        codes={codes}
        onGenerateCode={handleGenerateCode}
      />
    </div>
  );
};

export default App;
