import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// In-memory user store (use a real database in production)
let users = [
  {
    id: 1,
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all users
app.get('/', (req, res) => {
  res.json({
    users: users.map(({ password, ...user }) => user),
    total: users.length,
    timestamp: new Date().toISOString()
  });
});

// Get user by ID
app.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Create user
app.post('/', async (req, res) => {
  const { email, name, password, role = 'user' } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    name,
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// Update user
app.put('/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { email, name, role } = req.body;
  const updatedUser = {
    ...users[userIndex],
    ...(email && { email }),
    ...(name && { name }),
    ...(role && { role }),
    updatedAt: new Date().toISOString()
  };

  users[userIndex] = updatedUser;

  const { password, ...userWithoutPassword } = updatedUser;
  res.json(userWithoutPassword);
});

// Delete user
app.delete('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = users.find(u => u.email === email);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    token,
    user: userWithoutPassword
  });
});

// Get user profile (from token)
app.get('/profile/me', (req, res) => {
  // This would normally use JWT middleware to extract user info
  // For demo purposes, returning first user
  const { password, ...userWithoutPassword } = users[0];
  res.json(userWithoutPassword);
});

app.listen(PORT, () => {
  console.log(`👤 User Service running on port ${PORT}`);
});

export default app;