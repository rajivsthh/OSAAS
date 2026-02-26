// @ts-nocheck
// test-vulnerable-advanced.ts - Intentionally tricky vulnerabilities for testing
// WARNING: Contains intentional vulnerabilities for scanner demonstration only

const express = require('express');

const app = express();
app.use(express.json());

// Simulated data store
const accounts = [
  { id: '1001', ownerId: 'u-1', balance: 2500, tier: 'standard' },
  { id: '1002', ownerId: 'u-2', balance: 9900, tier: 'gold' },
  { id: '1003', ownerId: 'u-3', balance: 120, tier: 'basic' }
];

// HIGH: IDOR + logic flaw
// - IDOR: No authorization check on account ID
// - Logic flaw: Trusts x-user-id header without validation
app.get('/api/accounts/:id', (req, res) => {
  const accountId = req.params.id;
  const callerId = req.header('x-user-id');

  // Vulnerable: allows any caller to access any account
  // Vulnerable: header-based identity is trivially spoofed
  const account = accounts.find((item) => item.id === accountId);

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  res.json({ callerId, account });
});

// HIGH: Regex ReDoS
// Catastrophic backtracking on long input like: aaaaaaaaaaaaaaaaaaaaa!
app.get('/api/search', (req, res) => {
  const term = String(req.query.term || '');

  // Vulnerable: unsafe regex with catastrophic backtracking
  const re = /^(a+)+$/;
  const matched = re.test(term);

  res.json({ matched, length: term.length });
});

module.exports = app;
