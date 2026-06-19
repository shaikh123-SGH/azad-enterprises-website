/**
 * Azad Enterprises - Express server
 * Serves the static website + provides API endpoints for the
 * contact form and quotation form (with email sending via Nodemailer).
 */
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');

// Security & parsing middleware
app.use(helmet({
  contentSecurityPolicy: false,        // we use inline JSON-LD + Google Maps iframe
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

// Basic request log
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rate-limit API endpoints to discourage spam
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,            // 10 minutes
  max: 20,                             // 20 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});
app.use('/api', apiLimiter, apiRoutes);

// Static site
app.use(express.static(ROOT, { extensions: ['html'] }));

// SPA-style fallback for clean URLs (e.g. /about → about.html)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(ROOT, 'index.html'), err => err && next());
});

// Centralised error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n✅ Azad Enterprises website running at http://localhost:${PORT}\n`);
});
