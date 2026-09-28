import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizePhoneNumber } from '../services/twilio.service.js';

test('normalizePhoneNumber converts local Pakistani numbers into valid international format', () => {
  assert.equal(normalizePhoneNumber('923001234567'), '+923001234567');
  assert.equal(normalizePhoneNumber('+923001234567'), '+923001234567');
  assert.equal(normalizePhoneNumber(' 0300 1234567 '), '+923001234567');
});
