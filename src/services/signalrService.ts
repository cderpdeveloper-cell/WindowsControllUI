import * as signalR from '@microsoft/signalr';
import { MetricsData } from '../types';
import { API_BASE } from '../api';

class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;
  private isConnecting = false;
  private metricsListeners: ((metrics: MetricsData) => void)[] = [];
  private computerOnlineListeners: ((agentId: string) => void)[] = [];
  private computerOfflineListeners: ((agentId: string) => void)[] = [];
  private commandResultListeners: ((commandId: string, result: string, success: boolean) => void)[] = [];

  public async connect(): Promise<boolean> {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return true;
    }
    if (this.isConnecting) return false;

    this.isConnecting = true;
    try {
      const hubUrl = API_BASE ? `${API_BASE.replace(/\/$/, '')}/hubs/dashboard` : '/hubs/dashboard';
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => localStorage.getItem('accessToken') || '',
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      this.hubConnection.on('MetricsUpdated', (metrics: MetricsData) => {
        this.metricsListeners.forEach((listener) => listener(metrics));
      });

      this.hubConnection.on('AgentOnline', (agentId: string) => {
        this.computerOnlineListeners.forEach((listener) => listener(agentId));
      });

      this.hubConnection.on('AgentOffline', (agentId: string) => {
        this.computerOfflineListeners.forEach((listener) => listener(agentId));
      });

      this.hubConnection.on('CommandCompleted', (commandId: string, result: string, success: boolean) => {
        this.commandResultListeners.forEach((listener) => listener(commandId, result, success));
      });

      await this.hubConnection.start();
      console.log('SignalR connected to Dashboard Hub');
      this.isConnecting = false;
      return true;
    } catch (err) {
      console.warn('SignalR connection failed (backend might be offline or unauthorized). Operating in live simulated telemetry mode:', err);
      this.isConnecting = false;
      return false;
    }
  }

  public isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }

  public onMetrics(callback: (metrics: MetricsData) => void) {
    this.metricsListeners.push(callback);
    return () => {
      this.metricsListeners = this.metricsListeners.filter((l) => l !== callback);
    };
  }

  public onAgentOnline(callback: (agentId: string) => void) {
    this.computerOnlineListeners.push(callback);
    return () => {
      this.computerOnlineListeners = this.computerOnlineListeners.filter((l) => l !== callback);
    };
  }

  public onAgentOffline(callback: (agentId: string) => void) {
    this.computerOfflineListeners.push(callback);
    return () => {
      this.computerOfflineListeners = this.computerOfflineListeners.filter((l) => l !== callback);
    };
  }

  public onCommandResult(callback: (commandId: string, result: string, success: boolean) => void) {
    this.commandResultListeners.push(callback);
    return () => {
      this.commandResultListeners = this.commandResultListeners.filter((l) => l !== callback);
    };
  }

  public async watchComputer(computerId: string) {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('WatchComputer', computerId);
    }
  }

  public async unwatchComputer(computerId: string) {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('UnwatchComputer', computerId);
    }
  }
}

export const signalRService = new SignalRService();
