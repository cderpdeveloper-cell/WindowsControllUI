import React, { useState } from 'react';
import { KeyRound, Copy, Check, Download, Terminal, Shield, RefreshCw } from 'lucide-react';
import { EnrollmentCode } from '../types';

interface EnrollmentPageProps {
  codes: EnrollmentCode[];
  onOpenGenerateModal: () => void;
}

export const EnrollmentPage: React.FC<EnrollmentPageProps> = ({ codes, onOpenGenerateModal }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const gpoScript = `# Active Directory Group Policy (GPO) Startup Script
$ServerUrl = "http://wcc-server.corp.contoso.local:5000"
$EnrollmentCode = "${codes[0]?.code || 'WCC-CORP-9882-XQ'}"

if (-not (Get-Service "WindowsControlCenterAgent" -ErrorAction SilentlyContinue)) {
    Write-Host "Deploying Windows Control Center Enterprise Agent..."
    $installer = "$env:TEMP\\WCCAgentSetup.msi"
    Invoke-WebRequest -Uri "$ServerUrl/api/agents/download/msi" -OutFile $installer
    Start-Process msiexec.exe -ArgumentList "/i \`"$installer\`" SERVER_URL=\`"$ServerUrl\`" ENROLLMENT_CODE=\`"$EnrollmentCode\`" /qn" -Wait
}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Agent Fleet Enrollment & Deployment</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>
            Automated provisioning tokens, Group Policy deployment scripts, and silent MSI installers
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenGenerateModal}>
          + Create Enrollment Token
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Active Codes */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Active Enrollment Tokens</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Uses</th>
                <th>Expires</th>
                <th style={{ textAlign: 'right' }}>Copy</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-blue)' }}>
                    {c.code}
                  </td>
                  <td style={{ fontSize: 12 }}>{c.description}</td>
                  <td>
                    {c.usedCount} / {c.maxUses}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(c.expiresAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 8px' }}
                      onClick={() => copyCode(c.code)}
                    >
                      {copiedCode === c.code ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mass GPO Deployment */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Active Directory GPO Startup Script</span>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 11, padding: '2px 8px' }}
              onClick={() => copyCode(gpoScript)}
            >
              {copiedCode === gpoScript ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              <span>Copy GPO Script</span>
            </button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
            Place this in your Domain Controller GPO startup script share (\\domain\sysvol\Policies\...):
          </p>
          <pre
            style={{
              padding: '12px 14px',
              background: '#090a10',
              border: '1px solid #1e293b',
              borderRadius: 6,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              color: '#38bdf8',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.4,
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {gpoScript}
          </pre>
        </div>
      </div>
    </div>
  );
};
