import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Shield, Download, CheckCircle, Clock } from 'lucide-react';
import { EnrollmentCode } from '../../types';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  codes: EnrollmentCode[];
  onGenerateCode: (desc: string, days: number) => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  codes,
  onGenerateCode,
}) => {
  if (!isOpen) return null;

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [description, setDescription] = useState('');
  const [validityDays, setValidityDays] = useState(30);

  const activeCode = codes[0]?.code || 'WCC-CORP-9882-XQ';
  const installOneLiner = `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; iex ((New-Object System.Net.WebClient).DownloadString('http://localhost:5000/api/agents/install.ps1')); Install-WCCAgent -ServerUrl 'http://localhost:5000' -EnrollmentCode '${activeCode}'`;

  const copyToClipboard = (text: string, isCode = false) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } else {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onGenerateCode(description, validityDays);
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ width: '780px', maxWidth: '90vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Terminal size={20} />
            </div>
            <div>
              <div className="modal-title">Enroll New Windows Endpoint</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Deploy agent on Windows 10/11 or Windows Server 2016-2025
              </div>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Method 1: PowerShell 1-Click One-Liner */}
          <div className="card" style={{ background: 'var(--bg-input)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)' }}>
                METHOD 1: INSTANT POWERSHELL COMMAND (ELEVATED)
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => copyToClipboard(installOneLiner)}
                style={{ padding: '4px 10px', fontSize: 12 }}
              >
                {copiedCmd ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCmd ? 'Copied to Clipboard' : 'Copy Command'}</span>
              </button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
              Open administrative PowerShell on the target Windows machine and paste:
            </div>
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
                wordBreak: 'break-all',
                lineHeight: 1.4,
              }}
            >
              {installOneLiner}
            </pre>
          </div>

          {/* Active Enrollment Codes */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Active Enrollment Codes</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code Token</th>
                  <th>Description</th>
                  <th>Status</th>
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
                    <td style={{ fontSize: 12.5 }}>{c.description || 'General Enrollment'}</td>
                    <td>
                      <span className="status-badge online" style={{ fontSize: 11 }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {c.usedCount} / {c.maxUses}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(c.expiresAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '2px 8px' }}
                        onClick={() => copyToClipboard(c.code, true)}
                      >
                        {copiedCode === c.code ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Generate Code Form */}
          <form onSubmit={handleGenerate} className="card" style={{ background: 'var(--bg-secondary)' }}>
            <div className="card-header">
              <span className="card-title">Generate New Enrollment Token</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 12, alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Description / Scope Tag</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Finance Laptops, AWS Windows EC2..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Validity Period</label>
                <select
                  className="input"
                  value={validityDays}
                  onChange={(e) => setValidityDays(Number(e.target.value))}
                >
                  <option value={1}>24 Hours</option>
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: 40 }}>
                + Generate Token
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
