import React, { useState, useEffect } from 'react';
import { Server, Activity, Users, Package, ShoppingCart, Bell, Shield, BarChart3, Database, Cloud, Zap } from 'lucide-react';
import ServiceDashboard from './components/ServiceDashboard';
import APIGateway from './components/APIGateway';
import Architecture from './components/Architecture';
import Monitoring from './components/Monitoring';
import Documentation from './components/Documentation';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [services, setServices] = useState([
    { id: 'gateway', name: 'API Gateway', status: 'running', port: 3001, requests: 1247, uptime: '99.9%', icon: Shield },
    { id: 'user', name: 'User Service', status: 'running', port: 3002, requests: 423, uptime: '99.8%', icon: Users },
    { id: 'product', name: 'Product Service', status: 'running', port: 3003, requests: 634, uptime: '100%', icon: Package },
    { id: 'order', name: 'Order Service', status: 'running', port: 3004, requests: 287, uptime: '99.7%', icon: ShoppingCart },
    { id: 'notification', name: 'Notification Service', status: 'running', port: 3005, requests: 156, uptime: '99.9%', icon: Bell }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setServices(prevServices =>
        prevServices.map(service => ({
          ...service,
          requests: service.requests + Math.floor(Math.random() * 10),
          uptime: (Math.random() * 0.5 + 99.5).toFixed(1) + '%'
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'gateway', name: 'API Gateway', icon: Shield },
    { id: 'architecture', name: 'Architecture', icon: Server },
    { id: 'monitoring', name: 'Monitoring', icon: Activity },
    { id: 'docs', name: 'Documentation', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Scalable API Gateway</h1>
              <p className="text-sm text-gray-400">Cloud-Native Microservices Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-900 bg-opacity-30 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'dashboard' && <ServiceDashboard services={services} />}
        {activeTab === 'gateway' && <APIGateway />}
        {activeTab === 'architecture' && <Architecture />}
        {activeTab === 'monitoring' && <Monitoring services={services} />}
        {activeTab === 'docs' && <Documentation />}
      </main>
    </div>
  );
}

export default App;