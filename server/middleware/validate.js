const validator = require('validator');

function clean(v, max = 500) {
  if (typeof v !== 'string') return '';
  return validator.escape(v.trim()).slice(0, max);
}

function validateContact(req, res, next) {
  const { name, email, phone, message } = req.body || {};
  const errors = [];
  if (!name || !validator.isLength(name.trim(), { min: 2, max: 100 })) errors.push('Valid name is required');
  if (!email || !validator.isEmail(String(email))) errors.push('Valid email is required');
  if (!phone || !validator.isLength(String(phone).trim(), { min: 7, max: 20 })) errors.push('Valid phone number is required');
  if (!message || !validator.isLength(String(message).trim(), { min: 5, max: 2000 })) errors.push('Message is required (min 5 chars)');

  if (errors.length) return res.status(400).json({ success: false, message: errors.join('. ') });

  req.body = {
    name: clean(name, 100),
    email: validator.normalizeEmail(String(email)) || '',
    phone: clean(phone, 20),
    subject: clean(req.body.subject, 150),
    message: clean(message, 2000)
  };
  next();
}

function validateQuote(req, res, next) {
  const { name, email, phone, category, items } = req.body || {};
  const errors = [];
  if (!name || !validator.isLength(name.trim(), { min: 2, max: 100 })) errors.push('Valid name is required');
  if (!email || !validator.isEmail(String(email))) errors.push('Valid email is required');
  if (!phone || !validator.isLength(String(phone).trim(), { min: 7, max: 20 })) errors.push('Valid phone is required');
  if (!category || !validator.isLength(String(category).trim(), { min: 2, max: 100 })) errors.push('Select a product category');
  if (!items || !validator.isLength(String(items).trim(), { min: 5, max: 3000 })) errors.push('Please list the items / specifications');

  if (errors.length) return res.status(400).json({ success: false, message: errors.join('. ') });

  req.body = {
    name: clean(name, 100),
    email: validator.normalizeEmail(String(email)) || '',
    phone: clean(phone, 20),
    company: clean(req.body.company, 150),
    category: clean(category, 100),
    location: clean(req.body.location, 150),
    items: clean(items, 3000),
    notes: clean(req.body.notes, 1000)
  };
  next();
}

module.exports = { validateContact, validateQuote };
