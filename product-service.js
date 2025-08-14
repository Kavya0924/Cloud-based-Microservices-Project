import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// In-memory product store
let products = [
  {
    id: 1,
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    category: 'Electronics',
    stock: 50,
    imageUrl: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling headphones',
    price: 199.99,
    category: 'Electronics',
    stock: 100,
    imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 299.99,
    category: 'Wearables',
    stock: 75,
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'product-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all products
app.get('/', (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({
    products: filteredProducts,
    total: filteredProducts.length,
    filters: { category, minPrice, maxPrice, search },
    timestamp: new Date().toISOString()
  });
});

// Get product by ID
app.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// Create product
app.post('/', (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price: parseFloat(price),
    category,
    stock: parseInt(stock) || 0,
    imageUrl: imageUrl || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product
app.put('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, description, price, category, stock, imageUrl } = req.body;
  const updatedProduct = {
    ...products[productIndex],
    ...(name && { name }),
    ...(description && { description }),
    ...(price && { price: parseFloat(price) }),
    ...(category && { category }),
    ...(stock !== undefined && { stock: parseInt(stock) }),
    ...(imageUrl && { imageUrl }),
    updatedAt: new Date().toISOString()
  };

  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

// Delete product
app.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.status(204).send();
});

// Get product categories
app.get('/meta/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({
    categories,
    count: categories.length
  });
});

// Update product stock
app.patch('/:id/stock', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { quantity, operation = 'set' } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ error: 'Quantity is required' });
  }

  switch (operation) {
    case 'add':
      product.stock += parseInt(quantity);
      break;
    case 'subtract':
      product.stock = Math.max(0, product.stock - parseInt(quantity));
      break;
    case 'set':
    default:
      product.stock = parseInt(quantity);
      break;
  }

  product.updatedAt = new Date().toISOString();
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`📦 Product Service running on port ${PORT}`);
});

export default app;