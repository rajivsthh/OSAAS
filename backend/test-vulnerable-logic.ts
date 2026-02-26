// @ts-nocheck
// test-vulnerable-logic.ts - Advanced logic flaws for scanner testing
// WARNING: Contains intentional vulnerabilities for scanner demonstration only

const express = require('express');

const app = express();
app.use(express.json());

// In-memory demo data
const users = [
  { id: 'u-1', email: 'alice@example.com', role: 'user' },
  { id: 'u-2', email: 'bob@example.com', role: 'user' },
  { id: 'u-3', email: 'admin@example.com', role: 'admin' }
];

const wallets = {
  'u-1': { balance: 100 },
  'u-2': { balance: 50 }
};

const coupons = {
  SAVE10: { percent: 10, singleUse: true },
  SAVE20: { percent: 20, singleUse: true }
};

const projects = [
  { id: 'p-1', ownerId: 'u-1', issues: [{ id: 'i-1', ownerId: 'u-1', comments: [{ id: 'c-1', ownerId: 'u-1', text: 'hello' }] }] },
  { id: 'p-2', ownerId: 'u-2', issues: [{ id: 'i-2', ownerId: 'u-2', comments: [{ id: 'c-2', ownerId: 'u-2', text: 'world' }] }] }
];

// HIGH: Auth bypass (step-up auth skipped)
// - Sensitive endpoint relies on isMfaVerified flag from client body
app.post('/api/admin/payouts', (req, res) => {
  const { userId, isMfaVerified } = req.body;

  // Vulnerable: trusts client-provided MFA flag
  if (!isMfaVerified) {
    return res.status(403).json({ error: 'MFA required' });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ success: true, message: 'Payout initiated', userId: user.id });
});

// HIGH: Race condition (double-spend / double refund)
// - No locking or idempotency key; parallel requests can drain balance
app.post('/api/wallets/:id/refund', async (req, res) => {
  const walletId = req.params.id;
  const amount = Number(req.body.amount || 0);

  if (!wallets[walletId]) {
    return res.status(404).json({ error: 'Wallet not found' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // Vulnerable: race window allows multiple refunds before balance update
  if (wallets[walletId].balance >= amount) {
    await new Promise((r) => setTimeout(r, 50)); // simulate slow DB
    wallets[walletId].balance -= amount;
    return res.json({ success: true, balance: wallets[walletId].balance });
  }

  res.status(409).json({ error: 'Insufficient balance' });
});

// HIGH: Business logic flaw (coupon stacking / price manipulation)
// - Allows stacking multiple coupons; no validation or single-use enforcement
app.post('/api/checkout', (req, res) => {
  const { items, couponCodes } = req.body;
  const subtotal = Array.isArray(items)
    ? items.reduce((sum, item) => sum + Number(item.price || 0), 0)
    : 0;

  let discount = 0;
  if (Array.isArray(couponCodes)) {
    couponCodes.forEach((code) => {
      const coupon = coupons[code];
      if (coupon) {
        discount += (subtotal * coupon.percent) / 100;
      }
    });
  }

  const total = Math.max(subtotal - discount, 0);
  res.json({ subtotal, discount, total });
});

// HIGH: Nested IDOR (project -> issue -> comment)
// - No ownership checks at any level
app.get('/api/projects/:projectId/issues/:issueId/comments/:commentId', (req, res) => {
  const { projectId, issueId, commentId } = req.params;

  // Vulnerable: any user can access nested resources by guessing IDs
  const project = projects.find((p) => p.id === projectId);
  const issue = project?.issues.find((i) => i.id === issueId);
  const comment = issue?.comments.find((c) => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  res.json({ comment });
});

module.exports = app;
