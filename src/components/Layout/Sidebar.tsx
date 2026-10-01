import React from 'react';
import {
  LayoutDashboard,
  Server,
  Terminal,
  Layers,
  Bell,
  ShieldCheck,
  KeyRound,
  FileText,
  Settings,
  Cpu,
  RefreshCw,
  Power
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  alertCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Fleet Overview', icon: LayoutDashboard },
    { id: 'computers', label: 'Windows Endpoints', icon: Server },
    { id: 'roles', label: 'IIS & Hyper-V & SQL', icon: Layers },
    { id: 'automation', label: 'PowerShell Automation', icon: Terminal },
    { id: 'alerts', label: 'Health & Alerts', icon: Bell, badge: alertCount > 0 ? alertCount : undefined },
    { id: 'enrollment', label: 'Agent Enrollment', icon: KeyRound },
    { id: 'audit', label: 'Audit Trail & Security', icon: ShieldCheck },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 45,
          }}
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #0078D4 0%, #002050 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 120, 212, 0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            🪟
          </div>
          <div>
            <div className="sidebar-logo">Windows Control</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 0.5 }}>
              ENTERPRISE FLEET V2.0
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">MANAGEMENT CONSOLE</div>
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <div
                  key={item.id}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                >
                  <Icon size={18} className="sidebar-item-icon" />
                  <span style={{ flex: 1 }}>{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="sidebar-section" style={{ marginTop: 16 }}>
            <div className="sidebar-section-title">SECURITY & OPERATIONS</div>
            {navItems.slice(4).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <div
                  key={item.id}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                >
                  <Icon size={18} className="sidebar-item-icon" />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      style={{
                        background: 'var(--accent-red)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 10,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--accent-green)',
                boxShadow: '0 0 8px var(--accent-green)',
              }}
            />
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Agent Hub: <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Active</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            SignalR WSS Gateway Online
          </div>
        </div>
      </aside>
    </>
  );
};
