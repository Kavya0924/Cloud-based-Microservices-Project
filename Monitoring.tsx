import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  status: string;
  port: number;
  requests: number;
  uptime: string;
  icon: React.ComponentType<any>;
}

interface MonitoringProps {
  services: Service[];
}

const Monitoring: React.FC<MonitoringProps> = ({ services }) => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      severity: 'warning',
      message: 'High memory usage detected on Order Service',
      timestamp: '2 min ago',
      resolved: false
    },
    {
      id: 2,
      severity: 'info',
      message: 'Auto-scaling triggered for User Service',
      timestamp: '5 min ago',
      resolved: true
    },
    {
      id: 3,
      severity: 'error',
      message: 'Database connection timeout resolved',
      timestamp: '15 min ago',
      resolved: true
    }
  ]);

  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 89
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 30 + 40),
        memory: Math.floor(Math.random() * 20 + 60),
        disk: Math.floor(Math.random() * 15 + 20),
        network: Math.floor(Math.random() * 40 + 70)
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <CheckCircle className="h-5 w-5 text-blue-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-900 bg-opacity-30 border-red-700';
      case 'warning':
        return 'bg-yellow-900 bg-opacity-30 border-yellow-700';
      case 'info':
        return 'bg-blue-900 bg-opacity-30 border-blue-700';
      default:
        return 'bg-gray-800 border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">CPU Usage</h3>
            <Activity className="h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <div className="text-2xl font-bold text-white mb-2">{metrics.cpu}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.cpu}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Memory Usage</h3>
            <Activity className="h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <div className="text-2xl font-bold text-white mb-2">{metrics.memory}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.memory}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Disk Usage</h3>
            <Activity className="h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <div className="text-2xl font-bold text-white mb-2">{metrics.disk}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.disk}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Network I/O</h3>
            <Activity className="h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <div className="text-2xl font-bold text-white mb-2">{metrics.network}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.network}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">System Alerts</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div>
                    <p className={`font-medium ${alert.resolved ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      {alert.resolved && (
                        <span className="px-2 py-1 bg-green-900 bg-opacity-50 text-green-400 text-xs rounded">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!alert.resolved && (
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Health */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Service Health Checks</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 bg-opacity-20 p-2 rounded">
                      <Icon className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{service.name}</p>
                      <p className="text-xs text-gray-400">Health check every 30s</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Healthy</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Response Time Trends</h2>
        <div className="h-40 flex items-end space-x-1">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-blue-600 to-blue-400 flex-1 rounded-t transition-all duration-300"
              style={{ height: `${Math.random() * 80 + 20}%` }}
            ></div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>-25min</span>
          <span>-20min</span>
          <span>-15min</span>
          <span>-10min</span>
          <span>-5min</span>
          <span>now</span>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;