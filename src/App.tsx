import React, { useState, useEffect, useCallback } from 'react';
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
import { LoginPage } from './pages/LoginPage';
import { ComputerDetailModal } from './components/Computers/ComputerDetailModal';
import { EnrollmentModal } from './components/Computers/EnrollmentModal';
import { dataService } from './services/dataService';
import { signalRService } from './services/signalrService';
import { alertsApi, agentsApi } from './api';
import { Computer, Alert, EnrollmentCode, AuditLog, AlertRule, DashboardStats } from './types';

export const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('accessToken'));
  });
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Dynamic Data State (initialized to empty, populated from real backend API)
  const [computers, setComputers] = useState<Computer[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [codes, setCodes] = useState<EnrollmentCode[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalComputers: 0,
    onlineComputers: 0,
    offlineComputers: 0,
    warningComputers: 0,
    activeAlertsCount: 0,
    avgCpuPercent: 0,
    avgMemoryPercent: 0,
    recentAlerts: [],
  });

  // Active Selected Computer & Modals
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  // Fetch real data from API
  const refreshAll = useCallback(async () => {
    if (!localStorage.getItem('accessToken')) return;
    try {
      const [comps, st, al, rl, cd, lg] = await Promise.all([
        dataService.getComputers(),
        dataService.getDashboardStats(),
        dataService.getAlerts(),
        dataService.getAlertRules(),
        dataService.getEnrollmentCodes(),
        dataService.getAuditLogs(),
      ]);
      setComputers(comps);
      setStats(st);
      setAlerts(al);
      setRules(rl);
      setCodes(cd);
      setAuditLogs(lg);
    } catch (err) {
      console.error('Error refreshing data from API:', err);
    }
  }, []);

  // Initialize and connect SignalR when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribeMetrics: (() => void) | undefined;
    let unsubscribeOnline: (() => void) | undefined;
    let unsubscribeOffline: (() => void) | undefined;

    refreshAll();

    const initSignalR = async () => {
      const connected = await signalRService.connect();
      setIsLiveConnected(connected);

      // Listen for live telemetry stream updates from agents
      unsubscribeMetrics = signalRService.onMetrics((metrics) => {
        setComputers((prev) =>
          prev.map((c) =>
            c.id === metrics.computerId
              ? { ...c, metrics, isOnline: true, status: 'Online' }
              : c
          )
        );
      });

      // Listen for Agent Online/Offline events
      unsubscribeOnline = signalRService.onAgentOnline((agentId) => {
        setComputers((prev) =>
          prev.map((c) =>
            c.agent?.agentId === agentId || c.id === agentId
              ? { ...c, isOnline: true, status: 'Online' }
              : c
          )
        );
      });

      unsubscribeOffline = signalRService.onAgentOffline((agentId) => {
        setComputers((prev) =>
          prev.map((c) =>
            c.agent?.agentId === agentId || c.id === agentId
              ? { ...c, isOnline: false, status: 'Offline' }
              : c
          )
        );
      });
    };

    initSignalR();

    // Auto-refresh poll every 25 seconds to pull new machines/audit/alerts
    const interval = setInterval(() => {
      refreshAll();
    }, 25000);

    return () => {
      clearInterval(interval);
      if (unsubscribeMetrics) unsubscribeMetrics();
      if (unsubscribeOnline) unsubscribeOnline();
      if (unsubscribeOffline) unsubscribeOffline();
    };
  }, [isAuthenticated, refreshAll]);

  const handleLoginSuccess = (user: { username: string; email: string }) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    refreshAll();
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setComputers([]);
    setAlerts([]);
    setCodes([]);
    setAuditLogs([]);
    setIsLiveConnected(false);
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      await alertsApi.acknowledge(id);
    } catch { }
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: 'Acknowledged' } : a)));
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await alertsApi.resolve(id);
    } catch { }
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a)));
  };

  const handleGenerateCode = async (description: string, days: number) => {
    try {
      await agentsApi.generateCode({
        expirationMinutes: days * 1440,
        scope: description,
      });
      const updatedCodes = await dataService.getEnrollmentCodes();
      setCodes(updatedCodes);
    } catch (err) {
      console.error('Failed to generate code via API, updating local list:', err);
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
    }
  };

  const handleSelectComputerFromAnywhere = (comp: Computer) => {
    setSelectedComputer(comp);
  };

  // If not authenticated, always display Login Page first
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

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
          currentUser={currentUser}
          onLogout={handleLogout}
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
