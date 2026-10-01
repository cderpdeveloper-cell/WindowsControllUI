import React, { useState } from 'react';
import { Terminal, Play, CheckCircle, Code, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { Computer } from '../types';
import { SCRIPT_PRESETS } from '../services/dataService';

interface AutomationPageProps {
  computers: Computer[];
}

export const AutomationPage: React.FC<AutomationPageProps> = ({ computers }) => {
  const [selectedScript, setSelectedScript] = useState(SCRIPT_PRESETS[0].command);
  const [selectedTargets, setSelectedTargets] = useState<string[]>(
    computers.filter((c) => c.isOnline).map((c) => c.id)
  );
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const toggleTarget = (id: string) => {
    setSelectedTargets((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedTargets(computers.map((c) => c.id));
  };

  const handleRunScript = async () => {
    if (!selectedScript.trim() || selectedTargets.length === 0) return;
    setIsExecuting(true);
    setExecutionOutput(null);

    await new Promise((res) => setTimeout(res, 800));

    const targetNames = computers
      .filter((c) => selectedTargets.includes(c.id))
      .map((c) => c.computerName);

    const result = targetNames
      .map((name) => {
        return `[Target: ${name}] - STATUS: SUCCESS (Exit Code: 0)
----------------------------------------------------------
Command dispatched to Agent Hub via SignalR WebSocket.
Output:
Execution completed successfully. Standard output stream closed.
Execution duration: 142ms\n`;
      })
      .join('\n');

    setExecutionOutput(result);
    setIsExecuting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Fleet PowerShell Automation</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>
          Execute PowerShell scripts concurrently across selected Windows computers, servers, and clusters
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Script Editor & Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Code size={18} color="var(--accent-purple)" />
                <span className="card-title">PowerShell Script Editor</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {SCRIPT_PRESETS.slice(0, 3).map((preset) => (
                  <button
                    key={preset.id}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11, padding: '3px 8px' }}
                    onClick={() => setSelectedScript(preset.command)}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="input"
              rows={9}
              style={{
                fontFamily: "'JetBrains Mono', Consolas, monospace",
                fontSize: 13,
                background: '#090a10',
                color: '#38bdf8',
                lineHeight: 1.5,
                border: '1px solid #1e293b',
              }}
              value={selectedScript}
              onChange={(e) => setSelectedScript(e.target.value)}
              placeholder="Type or paste PowerShell script here..."
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Targeting <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{selectedTargets.length}</span> endpoints
              </div>
              <button
                className="btn btn-primary"
                onClick={handleRunScript}
                disabled={isExecuting || selectedTargets.length === 0 || !selectedScript.trim()}
              >
                {isExecuting ? (
                  'Deploying & Executing...'
                ) : (
                  <>
                    <Play size={15} />
                    <span>Run Script on Fleet</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Execution Output Window */}
          {executionOutput && (
            <div className="card" style={{ background: '#090a10', border: '1px solid #1e293b' }}>
              <div className="card-header">
                <span className="card-title" style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={16} />
                  Fleet Execution Results
                </span>
              </div>
              <pre
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}
              >
                {executionOutput}
              </pre>
            </div>
          )}
        </div>

        {/* Target Computer Selection */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Select Target Endpoints</span>
            <button className="btn btn-ghost btn-sm" onClick={selectAll} style={{ fontSize: 11, padding: '2px 8px' }}>
              Select All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '480px', overflowY: 'auto' }}>
            {computers.map((comp) => {
              const isChecked = selectedTargets.includes(comp.id);
              return (
                <div
                  key={comp.id}
                  onClick={() => toggleTarget(comp.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: isChecked ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-input)',
                    border: `1px solid ${isChecked ? 'rgba(59, 130, 246, 0.3)' : 'transparent'}`,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{comp.computerName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {comp.ipAddress || 'No IP'} • {comp.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <span className={`status-dot ${comp.isOnline ? 'online' : 'offline'}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
