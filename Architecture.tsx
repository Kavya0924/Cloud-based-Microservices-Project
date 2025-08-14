import React from 'react';
import { Server, Database, Shield, Cloud, ArrowRight, GitBranch } from 'lucide-react';

const Architecture: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">System Architecture</h2>
        
        <div className="space-y-8">
          {/* Client Layer */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-blue-900 bg-opacity-30 px-6 py-3 rounded-lg">
              <Cloud className="h-6 w-6 text-blue-400" />
              <span className="text-white font-medium">Client Applications</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
          </div>

          {/* Load Balancer */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-purple-900 bg-opacity-30 px-6 py-3 rounded-lg">
              <GitBranch className="h-6 w-6 text-purple-400" />
              <span className="text-white font-medium">Load Balancer</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
          </div>

          {/* API Gateway */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-green-900 bg-opacity-30 px-6 py-3 rounded-lg">
              <Shield className="h-6 w-6 text-green-400" />
              <span className="text-white font-medium">API Gateway</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
          </div>

          {/* Microservices */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['User Service', 'Product Service', 'Order Service', 'Notification Service'].map((service) => (
              <div key={service} className="text-center">
                <div className="bg-orange-900 bg-opacity-30 px-4 py-3 rounded-lg">
                  <Server className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <span className="text-white text-sm font-medium">{service}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
          </div>

          {/* Database Layer */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-red-900 bg-opacity-30 px-6 py-3 rounded-lg">
              <Database className="h-6 w-6 text-red-400" />
              <span className="text-white font-medium">Database Cluster</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Container Orchestration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Platform</span>
              <span className="text-blue-400">Kubernetes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Pods</span>
              <span className="text-white">15 running</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Namespaces</span>
              <span className="text-white">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Services</span>
              <span className="text-white">8</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Cloud Infrastructure</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Provider</span>
              <span className="text-blue-400">AWS/Azure</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Regions</span>
              <span className="text-white">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Availability Zones</span>
              <span className="text-white">6</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Auto Scaling</span>
              <span className="text-green-400">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Communication */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Service Communication Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ArrowRight className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="font-medium text-white mb-2">Synchronous (REST)</h4>
            <p className="text-sm text-gray-400">Direct HTTP API calls for real-time operations</p>
          </div>

          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <GitBranch className="h-6 w-6 text-green-400" />
            </div>
            <h4 className="font-medium text-white mb-2">Asynchronous (Events)</h4>
            <p className="text-sm text-gray-400">Message queues for decoupled processing</p>
          </div>

          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Database className="h-6 w-6 text-purple-400" />
            </div>
            <h4 className="font-medium text-white mb-2">Database per Service</h4>
            <p className="text-sm text-gray-400">Isolated data stores for each microservice</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Architecture;