const nodemailer = require('nodemailer');

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;     // not configured
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  return transporter;
}

async function sendMail(subject, html, replyTo) {
  const t = getTransporter();
  const to   = process.env.MAIL_TO   || 'azadenterprises@example.com';
  const from = process.env.MAIL_FROM || `"Azad Enterprises Website" <${process.env.SMTP_USER || 'no-reply@localhost'}>`;
  if (!t) {
    console.log('[EMAIL DISABLED] Would send:', { to, subject, replyTo });
    console.log(html);
    return { skipped: true };
  }
  return t.sendMail({ from, to, subject, html, replyTo });
}

function row(label, value) {
  return `<tr><td style="padding:6px 10px;background:#f4f7fb;font-weight:600">${label}</td><td style="padding:6px 10px">${value || '-'}</td></tr>`;
}

async function submitContact(req, res) {
  const { name, email, phone, subject, message } = req.body;
  const html = `
    <h2 style="color:#0057B8">New Contact Form Submission</h2>
    <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">
      ${row('Name', name)}
      ${row('Email', email)}
      ${row('Phone', phone)}
      ${row('Subject', subject)}
      ${row('Message', String(message).replace(/\n/g, '<br>'))}
      ${row('Received', new Date().toLocaleString('en-IN'))}
    </table>`;
  try {
    await sendMail(`New Contact: ${subject || name}`, html, email);
    return res.json({ success: true, message: 'Thank you! We have received your message and will get back to you shortly.' });
  } catch (err) {
    console.error('Contact email failed:', err);
    return res.status(500).json({ success: false, message: 'Could not send your message. Please try WhatsApp or call us directly.' });
  }
}

async function submitQuote(req, res) {
  const { name, email, phone, company, category, location, items, notes } = req.body;
  const html = `
    <h2 style="color:#0057B8">New Quotation Request</h2>
    <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">
      ${row('Name', name)}
      ${row('Email', email)}
      ${row('Phone', phone)}
      ${row('Company / Project', company)}
      ${row('Category', category)}
      ${row('Delivery Location', location)}
      ${row('Items', String(items).replace(/\n/g, '<br>'))}
      ${row('Notes', String(notes || '').replace(/\n/g, '<br>'))}
      ${row('Received', new Date().toLocaleString('en-IN'))}
    </table>`;
  try {
    await sendMail(`Quotation Request: ${category} - ${name}`, html, email);
    return res.json({ success: true, message: 'Thank you! Your quotation request has been submitted. We will reply with a detailed quote shortly.' });
  } catch (err) {
    console.error('Quote email failed:', err);
    return res.status(500).json({ success: false, message: 'Could not submit your quotation request. Please try WhatsApp or call us directly.' });
  }
}

module.exports = { submitContact, submitQuote };
