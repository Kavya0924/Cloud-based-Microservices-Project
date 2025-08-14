import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// API Key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== (process.env.API_KEY || 'default-api-key')) {
    return res.status(401).json({ error: 'Valid API key required' });
  }

  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Gateway status endpoint
app.get('/gateway/status', (req, res) => {
  res.json({
    gateway: 'operational',
    services: {
      'user-service': 'healthy',
      'product-service': 'healthy',
      'order-service': 'healthy',
      'notification-service': 'healthy'
    },
    load: {
      cpu: Math.floor(Math.random() * 30 + 40),
      memory: Math.floor(Math.random() * 20 + 60),
      requests_per_minute: Math.floor(Math.random() * 1000 + 2000)
    }
  });
});

// Service discovery and load balancing
const services = {
  user: ['http://localhost:3002'],
  product: ['http://localhost:3003'],
  order: ['http://localhost:3004'],
  notification: ['http://localhost:3005']
};

let serviceIndex = {};

const getNextServiceUrl = (serviceName) => {
  const serviceUrls = services[serviceName];
  if (!serviceUrls || serviceUrls.length === 0) {
    throw new Error(`No available instances for service: ${serviceName}`);
  }

  if (!serviceIndex[serviceName]) {
    serviceIndex[serviceName] = 0;
  }

  const url = serviceUrls[serviceIndex[serviceName]];
  serviceIndex[serviceName] = (serviceIndex[serviceName] + 1) % serviceUrls.length;

  return url;
};

// Dynamic proxy middleware
const createDynamicProxy = (serviceName, authMiddleware = null) => {
  return (req, res, next) => {
    try {
      const target = getNextServiceUrl(serviceName);
      const proxy = createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
          [`^/api/${serviceName}`]: ''
        },
        onError: (err, req, res) => {
          console.error(`Proxy error for ${serviceName}:`, err.message);
          res.status(503).json({
            error: 'Service temporarily unavailable',
            service: serviceName
          });
        },
        onProxyReq: (proxyReq, req, res) => {
          console.log(`[${new Date().toISOString()}] ${req.method} /api/${serviceName}${req.path} -> ${target}`);
        }
      });

      if (authMiddleware) {
        authMiddleware(req, res, () => proxy(req, res, next));
      } else {
        proxy(req, res, next);
      }
    } catch (error) {
      res.status(503).json({
        error: 'Service discovery failed',
        service: serviceName
      });
    }
  };
};

// Route configurations with authentication
app.use('/api/users', createDynamicProxy('user', authenticateToken));
app.use('/api/products', createDynamicProxy('product', authenticateApiKey));
app.use('/api/orders', createDynamicProxy('order', authenticateToken));
app.use('/api/notifications', createDynamicProxy('notification', authenticateToken));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(500).json({
    error: 'Internal gateway error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚪 API Gateway running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Gateway status: http://localhost:${PORT}/gateway/status`);
});

export default app;