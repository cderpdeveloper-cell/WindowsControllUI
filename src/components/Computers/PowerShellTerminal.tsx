import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Trash2, Copy, Check, Sparkles } from 'lucide-react';
import { SCRIPT_PRESETS } from '../../services/dataService';
import { Computer } from '../../types';

interface PowerShellTerminalProps {
  computer: Computer;
}

interface CommandLog {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  success: boolean;
  durationMs: number;
}

export const PowerShellTerminal: React.FC<PowerShellTerminalProps> = ({ computer }) => {
  const [commandInput, setCommandInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'Write-Host "Windows Control Center Remote Session Established" -ForegroundColor Green; hostname',
      output: `Windows Control Center Remote Session Established\n${computer.computerName}\nOS: ${computer.osName || 'Windows'}\nAgent Version: ${computer.agent?.version || '1.2.0'} (Active)`,
      timestamp: new Date().toLocaleTimeString(),
      success: true,
      durationMs: 45,
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const executeCommand = async (cmdText: string) => {
    if (!cmdText.trim()) return;
    setIsRunning(true);
    const start = performance.now();

    // Generate response based on command
    const trimmed = cmdText.trim();
    let output = '';
    let success = true;

    // Simulate authentic PowerShell outputs
    if (trimmed.toLowerCase().includes('clear-dnsclientcache') || trimmed.toLowerCase().includes('flushdns')) {
      output = `Windows IP Configuration\n\nSuccessfully flushed the DNS Resolver Cache.`;
    } else if (trimmed.toLowerCase().includes('get-process') || trimmed.toLowerCase().includes('ps')) {
      output = `Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id ProcessName\n-------  ------    -----      -----     ------     -- -----------\n    248      14     4210      12400       0.80      4 System\n    420      88   142100    1845020      34.20    980 sqlservr\n    160      32    45890     242080      18.50   1420 w3wp\n     88      21    18400      89000       2.10   3012 vmms\n     72      18    24100     184200       1.10   4208 explorer\n     18       9     8200      42600       0.20   2154 WindowsControlCenter.Agent`;
    } else if (trimmed.toLowerCase().includes('get-service')) {
      output = `Status   Name               DisplayName\n------   ----               -----------\nRunning  MSSQLSERVER        SQL Server (MSSQLSERVER)\nRunning  W3SVC              World Wide Web Publishing Service\nRunning  WindowsControlC... Windows Control Center Management Agent\nRunning  Dnscache           DNS Client\nRunning  TermService        Remote Desktop Services\nStopped  Spooler            Print Spooler`;
    } else if (trimmed.toLowerCase().includes('whoami')) {
      output = `USER INFORMATION\n----------------\nUser Name: CONTOSO\\Administrator\nSID:       S-1-5-21-392817462-1928471928-829103849-500\n\nPRIVILEGES INFORMATION\n----------------------\nPrivilege Name                Description                          State\n============================= ==================================== ========\nSeSecurityPrivilege           Manage auditing and security log     Enabled\nSeBackupPrivilege             Back up files and directories        Enabled\nSeRestorePrivilege            Restore files and directories        Enabled\nSeShutdownPrivilege           Shut down the system                 Enabled\nSeDebugPrivilege              Debug programs                       Enabled`;
    } else if (trimmed.toLowerCase().includes('get-hotfix')) {
      output = `Source        Description      HotFixID      InstalledBy          InstalledOn\n------        -----------      --------      -----------          -----------\n${computer.computerName} Security Update  KB5043076     NT AUTHORITY\\SYSTEM  9/10/2026 12:00:00 AM\n${computer.computerName} Update           KB5043141     NT AUTHORITY\\SYSTEM  9/18/2026 12:00:00 AM\n${computer.computerName} Security Update  KB5042880     NT AUTHORITY\\SYSTEM  8/20/2026 12:00:00 AM`;
    } else if (trimmed.toLowerCase().includes('get-psdrive')) {
      output = `Name Used(GB) Free(GB)\n---- -------- --------\nC       194.8   317.2\nD       718.0  1328.0\nE      4191.0  4001.0`;
    } else if (trimmed.toLowerCase().includes('ipconfig')) {
      output = `Windows IP Configuration\n\nEthernet adapter vEthernet (Production):\n   Connection-specific DNS Suffix  . : corp.contoso.local\n   IPv4 Address. . . . . . . . . . . : ${computer.ipAddress || '192.168.10.5'}\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.10.1\n   Physical Address. . . . . . . . . : ${computer.macAddress || '00-15-5D-01-A2-3B'}`;
    } else {
      output = `[Agent Remote Execution — ExitCode: 0]\nCommand '${trimmed}' executed successfully on ${computer.computerName}.\nOutput stream flushed with standard status.`;
    }

    await new Promise((res) => setTimeout(res, 350));
    const duration = Math.round(performance.now() - start);

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        command: trimmed,
        output,
        timestamp: new Date().toLocaleTimeString(),
        success,
        durationMs: duration,
      },
    ]);

    setCommandInput('');
    setIsRunning(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '620px', gap: 12 }}>
      {/* Script Preset Chips */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} color="var(--accent-blue)" />
          QUICK POWERSHELL DIAGNOSTIC RECIPES
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SCRIPT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className="btn btn-ghost btn-sm"
              onClick={() => executeCommand(preset.command)}
              disabled={isRunning || !computer.isOnline}
              style={{
                fontSize: 11.5,
                padding: '4px 10px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
              }}
              title={preset.description}
            >
              <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{preset.category}:</span> {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Viewport */}
      <div
        style={{
          flex: 1,
          background: '#090a10',
          border: '1px solid #232738',
          borderRadius: 8,
          padding: 16,
          overflowY: 'auto',
          fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
          fontSize: 12.5,
          color: '#e2e8f0',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ color: '#64748b', marginBottom: 12, borderBottom: '1px solid #1e293b', paddingBottom: 6 }}>
          Windows PowerShell 5.1 / 7.4 (Remote Runspace on {computer.computerName}) — Live WebSocket Gateway
        </div>

        {logs.map((log) => (
          <div key={log.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#38bdf8' }}>
              <div>
                <span style={{ color: '#a855f7' }}>PS C:\Windows\System32&gt;</span> {log.command}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#64748b' }}>
                <span>{log.durationMs}ms</span>
                <button
                  onClick={() => handleCopy(log.id, `${log.command}\n${log.output}`)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                  title="Copy command & output"
                >
                  {copiedId === log.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
            <pre
              style={{
                marginTop: 6,
                color: log.success ? '#cbd5e1' : '#f87171',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
              }}
            >
              {log.output}
            </pre>
          </div>
        ))}

        <div ref={consoleBottomRef} />
      </div>

      {/* Command Prompt Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeCommand(commandInput);
        }}
        style={{
          display: 'flex',
          gap: 8,
          background: 'var(--bg-card)',
          padding: '8px 12px',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-purple)', fontSize: 13 }}>
          PS&gt;
        </div>
        <input
          type="text"
          className="input"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            padding: 4,
          }}
          placeholder={
            computer.isOnline
              ? "Type PowerShell command (e.g. Get-Process, ipconfig, Get-EventLog -LogName System -Newest 5)..."
              : "Computer is offline. Commands queued will execute when agent reconnects."
          }
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          disabled={isRunning || !computer.isOnline}
        />

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setLogs([])}
          title="Clear screen"
        >
          <Trash2 size={14} />
        </button>

        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={isRunning || !commandInput.trim() || !computer.isOnline}
          style={{ minWidth: 90 }}
        >
          {isRunning ? (
            'Running...'
          ) : (
            <>
              <Play size={14} />
              <span>Run</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
