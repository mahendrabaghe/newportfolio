const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const dns = require('dns');

// Configure public DNS servers to resolve MongoDB Atlas SRV records reliably on Windows
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await ensureDefaultAdmin();
  })
  .catch(err => console.error(err));

// Import Models
const {
  Certification, Education, Experience,
  Message, Profile, Project, Skill, User
} = require('./models');

const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = 'password123';

const ensureDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });
  if (!existingAdmin) {
    await User.create({
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD
    });
    console.log(`Default admin created: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`);
  }
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const isApi = req.path.startsWith('/api/');
  const isHtml = req.path === '/' || req.path.endsWith('.html');
  const isAsset = /\.(js|css|png|jpe?g|gif|svg|webp|pdf|json)$/i.test(req.path);

  if (isApi || isHtml) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else if (isAsset) {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 0,
  etag: false,
  lastModified: false
}));

// --- JWT Auth Middleware ---
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// --- ROUTES ---

// Auth (Login)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ success: true, token });
});

// Profile route
app.get('/api/profile', async (req, res) => {
  const profile = await Profile.findOne();
  res.json(profile || {});
});
app.put('/api/profile', protect, async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create(req.body);
  else profile = await Profile.findByIdAndUpdate(profile._id, req.body, { new: true });
  res.json(profile);
});

// Generic CRUD Route Helper
const crud = (routePath, Model, options = {}) => {
  const getAuth = options.protectGet ? protect : (req, res, next) => next();
  const postAuth = options.protectPost !== false ? protect : (req, res, next) => next();

  app.get(`/api/${routePath}`, getAuth, async (req, res) => {
    let query = Model.find();
    if (Model.schema.paths.order) query = query.sort('order');
    if (Model.schema.paths.createdAt) query = query.sort('-createdAt');
    res.json(await query);
  });
  app.post(`/api/${routePath}`, postAuth, async (req, res) => {
    res.status(201).json(await Model.create(req.body));
  });
  app.put(`/api/${routePath}/:id`, protect, async (req, res) => {
    res.json(await Model.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  });
  app.delete(`/api/${routePath}/:id`, protect, async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });
};

// Apply CRUD routes
crud('experiences', Experience);
crud('projects', Project);
crud('skills', Skill);
crud('education', Education);
crud('certifications', Certification);
crud('messages', Message, { protectGet: true, protectPost: false }); // POST doesn't require auth

// Serve index.html for all other routes to support frontend routing/reloading
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
