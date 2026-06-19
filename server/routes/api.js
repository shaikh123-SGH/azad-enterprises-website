const express = require('express');
const router = express.Router();
const { submitContact, submitQuote } = require('../controllers/formController');
const { validateContact, validateQuote } = require('../middleware/validate');

router.get('/health', (_req, res) => res.json({ success: true, status: 'ok' }));

router.post('/contact', validateContact, submitContact);
router.post('/quote', validateQuote, submitQuote);

module.exports = router;
