import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// In-memory notification store
let notifications = [
  {
    id: 1,
    userId: 1,
    type: 'order_created',
    message: 'Your order #1001 has been created successfully',
    data: { orderId: 1001, total: 299.99 },
    read: false,
    createdAt: '2024-01-17T10:30:00.000Z'
  },
  {
    id: 2,
    userId: 1,
    type: 'order_shipped',
    message: 'Your order #1001 has been shipped',
    data: { orderId: 1001, trackingNumber: 'TRK123456789' },
    read: true,
    createdAt: '2024-01-18T14:22:00.000Z'
  },
  {
    id: 3,
    userId: 2,
    type: 'product_back_in_stock',
    message: 'Product "Laptop Pro" is back in stock',
    data: { productId: 1, productName: 'Laptop Pro' },
    read: false,
    createdAt: '2024-01-19T09:15:00.000Z'
  }
];

// Create HTTP server
const server = createServer(app);

// WebSocket server for real-time notifications
const wss = new WebSocketServer({ server });

// Store WebSocket connections by user ID
const connections = new Map();

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'authenticate' && data.userId) {
        connections.set(data.userId, ws);
        console.log(`User ${data.userId} connected via WebSocket`);
        
        ws.send(JSON.stringify({
          type: 'authenticated',
          message: 'Successfully authenticated'
        }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    // Remove connection from map
    for (const [userId, connection] of connections.entries()) {
      if (connection === ws) {
        connections.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Broadcast notification to user via WebSocket
const broadcastToUser = (userId, notification) => {
  const userConnection = connections.get(userId);
  if (userConnection && userConnection.readyState === 1) { // WebSocket.OPEN
    userConnection.send(JSON.stringify({
      type: 'notification',
      data: notification
    }));
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'notification-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    connections: connections.size
  });
});

// Get notifications for user
app.get('/', (req, res) => {
  const { userId, read, type } = req.query;
  let filteredNotifications = [...notifications];

  if (userId) {
    filteredNotifications = filteredNotifications.filter(n => 
      n.userId === parseInt(userId)
    );
  }

  if (read !== undefined) {
    filteredNotifications = filteredNotifications.filter(n => 
      n.read === (read === 'true')
    );
  }

  if (type) {
    filteredNotifications = filteredNotifications.filter(n => n.type === type);
  }

  // Sort by most recent first
  filteredNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    notifications: filteredNotifications,
    total: filteredNotifications.length,
    unread: filteredNotifications.filter(n => !n.read).length,
    filters: { userId, read, type },
    timestamp: new Date().toISOString()
  });
});

// Get notification by ID
app.get('/:id', (req, res) => {
  const notification = notifications.find(n => n.id === parseInt(req.params.id));
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  res.json(notification);
});

// Send notification
app.post('/send', (req, res) => {
  const { userId, type, message, data } = req.body;

  if (!userId || !type || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newNotification = {
    id: notifications.length + 1,
    userId: parseInt(userId),
    type,
    message,
    data: data || {},
    read: false,
    createdAt: new Date().toISOString()
  };

  notifications.push(newNotification);

  // Broadcast to user via WebSocket
  broadcastToUser(parseInt(userId), newNotification);

  res.status(201).json(newNotification);
});

// Mark notification as read
app.patch('/:id/read', (req, res) => {
  const notificationId = parseInt(req.params.id);
  const notification = notifications.find(n => n.id === notificationId);

  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notification.read = true;
  notification.readAt = new Date().toISOString();

  res.json(notification);
});

// Mark all notifications as read for a user
app.patch('/user/:userId/read-all', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userNotifications = notifications.filter(n => n.userId === userId && !n.read);

  userNotifications.forEach(notification => {
    notification.read = true;
    notification.readAt = new Date().toISOString();
  });

  res.json({
    marked: userNotifications.length,
    message: `Marked ${userNotifications.length} notifications as read`
  });
});

// Delete notification
app.delete('/:id', (req, res) => {
  const notificationId = parseInt(req.params.id);
  const notificationIndex = notifications.findIndex(n => n.id === notificationId);

  if (notificationIndex === -1) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notifications.splice(notificationIndex, 1);
  res.status(204).send();
});

// Get notification statistics
app.get('/stats/summary', (req, res) => {
  const { userId } = req.query;
  let targetNotifications = notifications;

  if (userId) {
    targetNotifications = notifications.filter(n => n.userId === parseInt(userId));
  }

  const total = targetNotifications.length;
  const unread = targetNotifications.filter(n => !n.read).length;
  const read = total - unread;

  const typeStats = targetNotifications.reduce((stats, notification) => {
    stats[notification.type] = (stats[notification.type] || 0) + 1;
    return stats;
  }, {});

  res.json({
    total,
    read,
    unread,
    typeStats,
    timestamp: new Date().toISOString()
  });
});

// Broadcast system notification to all connected users
app.post('/broadcast', (req, res) => {
  const { type, message, data } = req.body;

  if (!type || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const broadcast = {
    id: notifications.length + 1,
    type,
    message,
    data: data || {},
    broadcast: true,
    createdAt: new Date().toISOString()
  };

  // Send to all connected users via WebSocket
  connections.forEach((connection, userId) => {
    if (connection.readyState === 1) { // WebSocket.OPEN
      connection.send(JSON.stringify({
        type: 'broadcast',
        data: broadcast
      }));
    }
  });

  res.status(201).json({
    ...broadcast,
    sentTo: connections.size
  });
});

server.listen(PORT, () => {
  console.log(`🔔 Notification Service running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time notifications`);
});

export default app;