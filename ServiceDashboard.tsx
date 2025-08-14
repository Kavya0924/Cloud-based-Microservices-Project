import React from 'react';
import { TrendingUp, TrendingDown, Zap, Clock } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  status: string;
  port: number;
  requests: number;
  uptime: string;
  icon: React.ComponentType<any>;
}

interface ServiceDashboardProps {
  services: Service[];
}

const ServiceDashboard: React.FC<ServiceDashboardProps> = ({ services }) => {
  const totalRequests = services.reduce((sum, service) => sum + service.requests, 0);
  const runningServices = services.filter(service => service.status === 'running').length;

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Requests</p>
              <p className="text-2xl font-bold text-white">{totalRequests.toLocaleString()}</p>
            </div>
            <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-green-400 text-sm">+12.5%</span>
            <span className="text-gray-400 text-sm ml-1">from last hour</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Services</p>
              <p className="text-2xl font-bold text-white">{runningServices}/{services.length}</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-green-400 text-sm">100%</span>
            <span className="text-gray-400 text-sm ml-1">operational</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">143ms</p>
            </div>
            <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-green-400 text-sm">-8ms</span>
            <span className="text-gray-400 text-sm ml-1">improvement</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Error Rate</p>
              <p className="text-2xl font-bold text-white">0.12%</p>
            </div>
            <div className="bg-red-500 bg-opacity-20 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-green-400 text-sm">-0.03%</span>
            <span className="text-gray-400 text-sm ml-1">from yesterday</span>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Microservices Status</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{service.name}</h3>
                      <p className="text-sm text-gray-400">Port {service.port}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{service.requests.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">requests</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{service.uptime}</p>
                      <p className="text-xs text-gray-400">uptime</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.status === 'running'
                        ? 'bg-green-900 bg-opacity-50 text-green-400'
                        : 'bg-red-900 bg-opacity-50 text-red-400'
                    }`}>
                      {service.status}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Request Volume (Last 24 Hours)</h2>
        <div className="h-64 flex items-end space-x-2">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="bg-blue-500 flex-1 rounded-t"
              style={{ height: `${Math.random() * 100 + 20}%` }}
            ></div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceDashboard;