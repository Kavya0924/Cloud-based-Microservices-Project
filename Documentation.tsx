import React, { useState } from 'react';
import { Book, Code, Database, Server, Cloud, FileText, ExternalLink } from 'lucide-react';

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Book },
    { id: 'api', title: 'API Reference', icon: Code },
    { id: 'deployment', title: 'Deployment', icon: Server },
    { id: 'database', title: 'Database Schema', icon: Database },
    { id: 'cloud', title: 'Cloud Setup', icon: Cloud },
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/users',
      description: 'Retrieve all users',
      auth: 'JWT Token'
    },
    {
      method: 'POST',
      path: '/api/users',
      description: 'Create a new user',
      auth: 'JWT Token'
    },
    {
      method: 'GET',
      path: '/api/products',
      description: 'Retrieve all products',
      auth: 'API Key'
    },
    {
      method: 'POST',
      path: '/api/orders',
      description: 'Create a new order',
      auth: 'JWT Token'
    },
    {
      method: 'GET',
      path: '/api/notifications',
      description: 'Get user notifications',
      auth: 'JWT Token'
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-900 text-green-400';
      case 'POST':
        return 'bg-blue-900 text-blue-400';
      case 'PUT':
        return 'bg-yellow-900 text-yellow-400';
      case 'DELETE':
        return 'bg-red-900 text-red-400';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">System Overview</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                This scalable API Gateway demonstrates a complete cloud-native microservices architecture
                built with modern technologies including Docker, Kubernetes, and cloud infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• API Gateway with intelligent routing</li>
                  <li>• Load balancing and rate limiting</li>
                  <li>• Service discovery and health checks</li>
                  <li>• JWT authentication and authorization</li>
                  <li>• Real-time monitoring and alerting</li>
                  <li>• Auto-scaling based on demand</li>
                </ul>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <span className="text-blue-400">Node.js</span> - Runtime environment</li>
                  <li>• <span className="text-blue-400">Express.js</span> - Web framework</li>
                  <li>• <span className="text-blue-400">Docker</span> - Containerization</li>
                  <li>• <span className="text-blue-400">Kubernetes</span> - Orchestration</li>
                  <li>• <span className="text-blue-400">AWS/Azure</span> - Cloud platform</li>
                  <li>• <span className="text-blue-400">MongoDB</span> - Database</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Architecture Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Scalability</h4>
                  <p className="text-sm text-gray-400">Independent scaling of services based on demand</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Resilience</h4>
                  <p className="text-sm text-gray-400">Fault isolation and graceful degradation</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Maintainability</h4>
                  <p className="text-sm text-gray-400">Clean separation of concerns and modularity</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">API Reference</h2>
              <p className="text-gray-300 mb-6">
                Complete API documentation for all microservices accessible through the gateway.
              </p>
            </div>

            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-3 py-1 rounded text-sm font-mono ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <code className="text-white font-mono text-lg">{endpoint.path}</code>
                  </div>
                  <p className="text-gray-300 mb-2">{endpoint.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-400">Authentication:</span>
                    <span className="text-blue-400">{endpoint.auth}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Authentication</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">JWT Token Authentication</h4>
                  <p className="text-gray-300 mb-3">Include the JWT token in the Authorization header:</p>
                  <pre className="bg-gray-800 p-3 rounded text-green-400 text-sm overflow-x-auto">
                    Authorization: Bearer &lt;your-jwt-token&gt;
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">API Key Authentication</h4>
                  <p className="text-gray-300 mb-3">Include the API key in the X-API-Key header:</p>
                  <pre className="bg-gray-800 p-3 rounded text-green-400 text-sm overflow-x-auto">
                    X-API-Key: &lt;your-api-key&gt;
                  </pre>
                </div>
              </div>
            </div>
          </div>
        );

      case 'deployment':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Deployment Guide</h2>
              <p className="text-gray-300 mb-6">
                Step-by-step instructions for deploying the microservices architecture.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Docker Deployment</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">1. Build Docker Images</h4>
                  <pre className="bg-gray-800 p-3 rounded text-green-400 text-sm overflow-x-auto">
                    docker-compose build
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">2. Start Services</h4>
                  <pre className="bg-gray-800 p-3 rounded text-green-400 text-sm overflow-x-auto">
                    docker-compose up -d
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">3. View Logs</h4>
                  <pre className="bg-gray-800 p-3 rounded text-green-400 text-sm overflow-x-auto">
                    docker-compose logs -f
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Kubernetes Deployment</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">1. Apply Manifests</h4>
                  <pre className="bg-gray-800 p-3 rounded text-green-400 text-sm overflow-x-auto">
                    kubectl apply -f k8s/
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">2. Check Pod Status</h4>
                  <pre className="bg-gray-800 p-3 rounded text-green-400 text-sm overflow-x-auto">
                    kubectl get pods
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">3. View Services</h4>
                  <pre className="bg-gray-800 p-3 rounded text-green-400 text-sm overflow-x-auto">
                    kubectl get services
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Environment Variables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Required Variables</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• <code>NODE_ENV</code> - Environment (development/production)</li>
                    <li>• <code>DATABASE_URL</code> - Database connection string</li>
                    <li>• <code>JWT_SECRET</code> - JWT signing secret</li>
                    <li>• <code>API_KEY</code> - Internal API key</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Optional Variables</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• <code>LOG_LEVEL</code> - Logging verbosity</li>
                    <li>• <code>RATE_LIMIT</code> - Request rate limit</li>
                    <li>• <code>CACHE_TTL</code> - Cache time-to-live</li>
                    <li>• <code>HEALTH_CHECK_INTERVAL</code> - Health check frequency</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-300">Content for {activeSection}</div>;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Documentation</h2>
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Documentation;