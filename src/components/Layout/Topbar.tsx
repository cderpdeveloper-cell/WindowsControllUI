import React from 'react';
import { Menu, Search, Bell, Shield, User, RefreshCw, Radio, LogOut } from 'lucide-react';

interface TopbarProps {
  onToggleSidebar: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onRefresh: () => void;
  isLiveConnected: boolean;
  onOpenEnrollment: () => void;
  currentUser?: { username: string; email: string } | null;
  onLogout?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  searchTerm,
  onSearchChange,
  onRefresh,
  isLiveConnected,
  onOpenEnrollment,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          style={{ display: 'inline-flex' }}
        >
          <Menu size={22} />
        </button>

        <div className="topbar-search">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search computers by name, IP, OS, domain..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 20,
            background: isLiveConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${isLiveConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            fontSize: 12,
            fontWeight: 500,
            color: isLiveConnected ? 'var(--accent-green)' : 'var(--accent-yellow)',
          }}
        >
          <Radio size={14} className={isLiveConnected ? 'pulse' : ''} />
          <span>{isLiveConnected ? 'Live Telemetry (SignalR)' : 'Telemetry Streaming'}</span>
        </div>
      </div>

      <div className="topbar-right">
        <button
          className="btn btn-ghost btn-sm"
          onClick={onRefresh}
          title="Force refresh status"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenEnrollment}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <span>+ Enroll Computer</span>
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingLeft: 12,
            borderLeft: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 12,
              textTransform: 'uppercase',
            }}
          >
            {currentUser?.username?.slice(0, 2) || 'AD'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {currentUser?.username || 'Administrator'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {currentUser?.email || 'admin@windowscontrolcenter.com'}
            </span>
          </div>

          {onLogout && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={onLogout}
              title="Sign Out"
              style={{
                marginLeft: 4,
                padding: '6px 8px',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              <LogOut size={15} />
              <span style={{ fontSize: 12 }}>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
