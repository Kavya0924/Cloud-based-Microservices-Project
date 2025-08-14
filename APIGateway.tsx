import React, { useState } from 'react';
import { Shield, Route, Zap, Lock, BarChart3, Settings } from 'lucide-react';

const APIGateway: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);

  const routes = [
    {
      id: 'users',
      path: '/api/users/*',
      target: 'user-service:3002',
      method: 'ALL',
      rateLimit: '1000/min',
      auth: 'JWT',
      status: 'active'
    },
    {
      id: 'products',
      path: '/api/products/*',
      target: 'product-service:3003',
      method: 'ALL',
      rateLimit: '2000/min',
      auth: 'API Key',
      status: 'active'
    },
    {
      id: 'orders',
      path: '/api/orders/*',
      target: 'order-service:3004',
      method: 'ALL',
      rateLimit: '500/min',
      auth: 'JWT',
      status: 'active'
    },
    {
      id: 'notifications',
      path: '/api/notifications/*',
      target: 'notification-service:3005',
      method: 'ALL',
      rateLimit: '100/min',
      auth: 'JWT',
      status: 'active'
    }
  ];

  const middleware = [
    { name: 'Rate Limiting', enabled: true, icon: Zap },
    { name: 'Authentication', enabled: true, icon: Lock },
    { name: 'CORS', enabled: true, icon: Shield },
    { name: 'Logging', enabled: true, icon: BarChart3 },
    { name: 'Request Validation', enabled: true, icon: Settings },
    { name: 'Response Caching', enabled: false, icon: Route }
  ];

  return (
    <div className="space-y-6">
      {/* Gateway Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Routes</p>
              <p className="text-2xl font-bold text-white">{routes.length}</p>
            </div>
            <Route className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Requests/min</p>
              <p className="text-2xl font-bold text-white">3,847</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-white">99.87%</p>
            </div>
            <Shield className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Routes Configuration */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Route Configuration</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {routes.map((route) => (
            <div key={route.id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-blue-900 text-blue-400 text-xs rounded font-mono">
                      {route.method}
                    </span>
                    <code className="text-white font-mono">{route.path}</code>
                    <span className="text-gray-400">→</span>
                    <span className="text-blue-400">{route.target}</span>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                    <span>Rate: {route.rateLimit}</span>
                    <span>Auth: {route.auth}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      route.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {route.status}
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middleware */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Middleware Pipeline</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {middleware.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-blue-400" />
                    <span className="text-white">{item.name}</span>
                  </div>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      item.enabled ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        item.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Load Balancer Configuration */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Load Balancer</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Algorithm</span>
              <select className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600">
                <option>Round Robin</option>
                <option>Least Connections</option>
                <option>IP Hash</option>
                <option>Weighted Round Robin</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Health Check Interval</span>
              <span className="text-white">30s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Timeout</span>
              <span className="text-white">5s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIGateway;