import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// In-memory order store
let orders = [
  {
    id: 1,
    userId: 1,
    items: [
      { productId: 1, quantity: 1, price: 1299.99 },
      { productId: 2, quantity: 2, price: 199.99 }
    ],
    total: 1699.97,
    status: 'completed',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-16T14:22:00.000Z'
  },
  {
    id: 2,
    userId: 2,
    items: [
      { productId: 3, quantity: 1, price: 299.99 }
    ],
    total: 299.99,
    status: 'processing',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    createdAt: '2024-01-17T09:15:00.000Z',
    updatedAt: '2024-01-17T09:15:00.000Z'
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'order-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all orders
app.get('/', (req, res) => {
  const { userId, status } = req.query;
  let filteredOrders = [...orders];

  if (userId) {
    filteredOrders = filteredOrders.filter(o => o.userId === parseInt(userId));
  }

  if (status) {
    filteredOrders = filteredOrders.filter(o => o.status === status);
  }

  res.json({
    orders: filteredOrders,
    total: filteredOrders.length,
    filters: { userId, status },
    timestamp: new Date().toISOString()
  });
});

// Get order by ID
app.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

// Create order
app.post('/', async (req, res) => {
  const { userId, items, shippingAddress } = req.body;

  if (!userId || !items || !items.length || !shippingAddress) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Validate products exist and calculate total
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      try {
        // In a real system, this would call the product service through the gateway
        const productResponse = await axios.get(`http://localhost:3003/${item.productId}`);
        const product = productResponse.data;

        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for product ${product.name}` 
          });
        }

        validatedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          name: product.name
        });

        total += product.price * item.quantity;

        // Update product stock
        await axios.patch(`http://localhost:3003/${item.productId}/stock`, {
          quantity: item.quantity,
          operation: 'subtract'
        });

      } catch (error) {
        return res.status(400).json({ 
          error: `Invalid product ID: ${item.productId}` 
        });
      }
    }

    const newOrder = {
      id: orders.length + 1,
      userId: parseInt(userId),
      items: validatedItems,
      total: parseFloat(total.toFixed(2)),
      status: 'pending',
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);

    // Send notification (async)
    try {
      await axios.post('http://localhost:3005/send', {
        userId,
        type: 'order_created',
        message: `Your order #${newOrder.id} has been created successfully`,
        data: { orderId: newOrder.id, total: newOrder.total }
      });
    } catch (notificationError) {
      console.warn('Failed to send notification:', notificationError.message);
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
app.patch('/:id/status', async (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status', 
      validStatuses 
    });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  // Send status update notification
  try {
    await axios.post('http://localhost:3005/send', {
      userId: order.userId,
      type: 'order_status_updated',
      message: `Your order #${orderId} status has been updated to: ${status}`,
      data: { orderId, status }
    });
  } catch (notificationError) {
    console.warn('Failed to send notification:', notificationError.message);
  }

  res.json(order);
});

// Cancel order
app.delete('/:id', async (req, res) => {
  const orderId = parseInt(req.params.id);
  const orderIndex = orders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = orders[orderIndex];

  // Only allow cancellation of pending/processing orders
  if (!['pending', 'processing'].includes(order.status)) {
    return res.status(400).json({ 
      error: `Cannot cancel order with status: ${order.status}` 
    });
  }

  // Restore product stock
  try {
    for (const item of order.items) {
      await axios.patch(`http://localhost:3003/${item.productId}/stock`, {
        quantity: item.quantity,
        operation: 'add'
      });
    }
  } catch (error) {
    console.warn('Failed to restore stock:', error.message);
  }

  orders.splice(orderIndex, 1);

  // Send cancellation notification
  try {
    await axios.post('http://localhost:3005/send', {
      userId: order.userId,
      type: 'order_cancelled',
      message: `Your order #${orderId} has been cancelled`,
      data: { orderId }
    });
  } catch (notificationError) {
    console.warn('Failed to send notification:', notificationError.message);
  }

  res.status(204).send();
});

// Get order statistics
app.get('/stats/summary', (req, res) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const statusCounts = orders.reduce((counts, order) => {
    counts[order.status] = (counts[order.status] || 0) + 1;
    return counts;
  }, {});

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  res.json({
    totalOrders,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
    statusCounts,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🛒 Order Service running on port ${PORT}`);
});

export default app;